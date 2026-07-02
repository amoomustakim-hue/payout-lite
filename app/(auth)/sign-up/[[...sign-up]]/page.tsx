import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-16">
      <SignUp />
    </main>
  );
}
