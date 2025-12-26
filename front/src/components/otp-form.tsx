import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const otpSchema = z.object({
  otp: z.string().length(6, "O código deve ter 6 dígitos"),
})

type OTPFormData = z.infer<typeof otpSchema>

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const onSubmit = async (data: OTPFormData) => {
    // TODO: Implement OTP verification logic
    console.log("OTP:", data.otp)
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Código de verificação</CardTitle>
        <CardDescription>
          Enviamos um código de verificação de 6 dígitos para o seu e-mail.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                Codigo de verificação
              </FieldLabel>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              {errors.otp && <FieldError>{errors.otp.message}</FieldError>}
              <FieldDescription className="text-center">
                Insira o código de verificação enviado para o seu e-mail.
              </FieldDescription>
            </Field>
            <Button type="submit" isLoading={isSubmitting}>
              Verificar
            </Button>
            <FieldDescription className="text-center">
              Não recebeu o código? <a href="#">Reenviar</a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
