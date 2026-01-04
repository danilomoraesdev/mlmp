import { Logo } from '@/components/logo'
import { OTPForm } from '@/components/auth/otp-form'

export default function OTPPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo />
          MLMP
        </div>
        <OTPForm className="w-full max-w-sm mx-auto" />
      </div>
    </div>
  )
}
