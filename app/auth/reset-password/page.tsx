import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-8 text-center backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-white">Password reset link received</h1>
        <p className="mt-3 text-sm leading-7 text-gray-400">
          If your email provider supports it, you can now complete the reset flow from your inbox or return to sign in.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/auth/signin">Back to sign in</Link>
        </Button>
      </div>
    </div>
  )
}
