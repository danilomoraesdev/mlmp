import { Logo } from '@/components/logo'
import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo />
          MLMP
        </div>
        <SignupForm className="w-full max-w-sm mx-auto" />
      </div>
    </div>
  )
}
