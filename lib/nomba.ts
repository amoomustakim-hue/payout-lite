import "server-only";
import crypto from "node:crypto";

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

function getAppUrl() {
  return env("NEXT_PUBLIC_APP_URL", "http://localhost:3000").replace(/\/$/, "");
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

async function nombaFetch<T>(path: string, init: RequestInit = {}) {
  const token = await getNombaAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");
  headers.set("accountId", getParentAccountId());

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
  const raw = await nombaFetch<Record<string, unknown>>("/v1/accounts/virtual", {
    method: "POST",
    body: JSON.stringify({
      accountName: input.businessName,
      reference: input.reference,
      customerEmail: input.customerEmail,
      subAccountId,
    }),
  });

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

export function verifyNombaWebhook(rawBody: string, signature: string | null) {
  const secret = process.env.NOMBA_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const normalizedSignature = signature.replace(/^sha256=/, "");

  if (expected.length !== normalizedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(normalizedSignature));
}




