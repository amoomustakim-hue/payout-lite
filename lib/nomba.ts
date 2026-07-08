import "server-only";
import crypto from "node:crypto";
import { getAppUrl } from "@/lib/app-url";

type NombaTokenResponse = {
  access_token?: string;
  accessToken?: string;
  data?: {
    access_token?: string;
    accessToken?: string;
  };
};

type CheckoutOrderInput = {
  amount: number;
  currency?: string;
  reference: string;
  customerEmail?: string | null;
  customerName?: string | null;
  callbackUrl?: string;
  description?: string | null;
  subAccountId?: string | null;
  metadata?: Record<string, unknown>;
};

type CheckoutOrderResponse = {
  checkoutUrl?: string;
  checkoutUrlField?: string;
  orderReference?: string;
  raw: unknown;
};

type VirtualAccountInput = {
  businessName: string;
  reference: string;
  customerEmail?: string | null;
  subAccountId?: string | null;
};

type VirtualAccountResponse = {
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
  providerRef?: string;
  raw: unknown;
};

function env(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const requiredNombaEnvVars = ["NOMBA_ACCOUNT_ID", "NOMBA_CLIENT_ID", "NOMBA_PRIVATE_KEY"] as const;

export function getMissingNombaCheckoutEnvVars() {
  return requiredNombaEnvVars.filter((name) => !process.env[name]);
}

function getNombaBaseUrl() {
  return env("NOMBA_BASE_URL", "https://api.nomba.com").replace(/\/$/, "");
}

function getParentAccountId() {
  return env("NOMBA_ACCOUNT_ID");
}

function getDefaultSubAccountId() {
  return process.env.NOMBA_SUB_ACCOUNT_ID || undefined;
}


function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function firstStringField(source: Record<string, unknown>, fields: string[], prefix = "") {
  for (const field of fields) {
    const value = source[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return { value: value.trim(), field: `${prefix}${field}` };
    }
  }

  return null;
}

function extractCheckoutUrl(raw: Record<string, unknown>) {
  const urlFields = [
    "checkoutLink",
    "checkout_url",
    "checkoutUrl",
    "link",
    "paymentLink",
    "payment_link",
    "authorizationUrl",
    "authorization_url",
    "url",
  ];

  const data = asRecord(raw.data);
  const nestedData = firstStringField(data, urlFields, "data.");
  if (nestedData) {
    return nestedData;
  }

  return firstStringField(raw, urlFields);
}

async function nombaFetch<T>(path: string, init: RequestInit = {}, accountIdOverride?: string) {
  const token = await getNombaAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  headers.set("accountId", accountIdOverride ?? getParentAccountId());

  const response = await fetch(`${getNombaBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw new Error(`Nomba request failed: ${response.status} ${JSON.stringify(payload)}`);
  }

  return payload;
}

export async function getNombaAccessToken() {
  const clientId = env("NOMBA_CLIENT_ID");
  const privateKey = env("NOMBA_PRIVATE_KEY");

  const payload = await fetch(`${getNombaBaseUrl()}/v1/auth/token/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accountId: getParentAccountId(),
    },
    body: JSON.stringify({
      grantType: "client_credentials",
      clientId,
      clientSecret: privateKey,
    }),
  }).then(async (response) => {
    const json = (await response.json().catch(() => ({}))) as NombaTokenResponse;
    if (!response.ok) {
      throw new Error(`Nomba auth failed: ${response.status} ${JSON.stringify(json)}`);
    }
    return json;
  });

  const token = payload.access_token ?? payload.accessToken ?? payload.data?.access_token ?? payload.data?.accessToken;
  if (!token) {
    throw new Error("Nomba auth response did not include an access token");
  }

  return token;
}

export async function createNombaCheckoutOrder(input: CheckoutOrderInput): Promise<CheckoutOrderResponse> {
  const subAccountId = input.subAccountId ?? getDefaultSubAccountId();
  const payload = {
    amount: input.amount,
    currency: input.currency ?? "NGN",
    reference: input.reference,
    orderReference: input.reference,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    callbackUrl: input.callbackUrl ?? `${getAppUrl()}/transactions?reference=${input.reference}`,
    redirectUrl: input.callbackUrl ?? `${getAppUrl()}/transactions?reference=${input.reference}`,
    description: input.description,
    subAccountId,
    metadata: input.metadata,
  };

  const raw = await nombaFetch<Record<string, unknown>>("/v1/checkout/order", {
    method: "POST",
    body: JSON.stringify({ order: payload }),
  });
  const checkout = extractCheckoutUrl(raw);
  const data = asRecord(raw.data);

  console.info("Nomba checkout order response", {
    reference: input.reference,
    checkoutUrlField: checkout?.field ?? null,
    hasCheckoutUrl: Boolean(checkout?.value),
    responseKeys: Object.keys(raw),
    dataKeys: Object.keys(data),
  });

  return {
    checkoutUrl: checkout?.value,
    checkoutUrlField: checkout?.field,
    orderReference: String(data.orderReference ?? data.order_reference ?? data.reference ?? raw.orderReference ?? raw.order_reference ?? raw.reference ?? input.reference),
    raw,
  };
}

export async function createNombaVirtualAccount(input: VirtualAccountInput): Promise<VirtualAccountResponse> {
  const subAccountId = input.subAccountId ?? getDefaultSubAccountId();

  // Nomba scopes virtual account creation to the sub-account — the accountId
  // header must be the sub-account ID, not the parent account ID.
  // If no subAccountId is configured, fall back to parent (will likely 403).
  const accountIdForRequest = subAccountId ?? getParentAccountId();

  const body: Record<string, unknown> = {
    accountName: input.businessName,
    reference: input.reference,
  };
  if (input.customerEmail) body.customerEmail = input.customerEmail;
  if (subAccountId) body.subAccountId = subAccountId;

  console.info("Nomba virtual account request", JSON.stringify({ accountIdForRequest, body }));

  const raw = await nombaFetch<Record<string, unknown>>("/v1/accounts/virtual", {
    method: "POST",
    body: JSON.stringify(body),
  }, accountIdForRequest);

  console.info("Nomba virtual account raw response", JSON.stringify(raw));

  const data = asRecord(raw.data);

  return {
    accountNumber: String(data.accountNumber ?? data.account_number ?? ""),
    bankName: String(data.bankName ?? data.bank_name ?? ""),
    accountName: String(data.accountName ?? data.account_name ?? input.businessName),
    providerRef: String(data.id ?? data.reference ?? input.reference),
    raw,
  };
}

export async function fetchNombaTransaction(reference: string) {
  return nombaFetch<Record<string, unknown>>(`/v1/transactions/${encodeURIComponent(reference)}`, {
    method: "GET",
  });
}

export type NombaSignatureFields = {
  eventType?: string;
  requestId?: string;
  userId?: string;
  walletId?: string;
  transactionId?: string;
  type?: string;
  time?: string;
  responseCode?: string;
  timestamp?: string | null;
  signature?: string | null;
};

/**
 * Verifies a Nomba webhook signature.
 *
 * Per https://developer.nomba.com/docs/api-basics/webhook Nomba does NOT sign
 * the raw request body. It signs a colon-delimited string of specific fields
 * with HmacSHA256 and Base64-encodes the digest. The signature arrives in the
 * `nomba-signature` header and the timestamp in the `nomba-timestamp` header.
 *
 *   base = eventType:requestId:userId:walletId:transactionId:type:time:responseCode:timestamp
 *   signature = base64( HMAC_SHA256(signingKey, base) )
 *
 * `responseCode` is an empty string when it is null.
 */
export function verifyNombaWebhook(fields: NombaSignatureFields): boolean {
  const secret = process.env.NOMBA_WEBHOOK_SECRET;
  if (!secret || !fields.signature) {
    return false;
  }

  const responseCode =
    !fields.responseCode || fields.responseCode === "null" ? "" : fields.responseCode;

  const base = [
    fields.eventType ?? "",
    fields.requestId ?? "",
    fields.userId ?? "",
    fields.walletId ?? "",
    fields.transactionId ?? "",
    fields.type ?? "",
    fields.time ?? "",
    responseCode,
    fields.timestamp ?? "",
  ].join(":");

  const expected = crypto.createHmac("sha256", secret).update(base).digest("base64");

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(fields.signature);
  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}




