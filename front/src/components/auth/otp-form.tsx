import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const otpSchema = z.object({
  otp: z.string().length(6, 'O código deve ter 6 dígitos'),
})

type OTPFormData = z.infer<typeof otpSchema>

export function OTPForm() {
  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  const onSubmit = async (data: OTPFormData) => {
    // TODO: Implement OTP verification logic
    console.log('OTP:', data.otp)
  }

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Código de verificação</CardTitle>
        <CardDescription>
          Enviamos um código de verificação de 6 dígitos para o seu e-mail.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
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
                  </FormControl>
                  <FormMessage />
                  <p className="text-muted-foreground text-sm text-center">
                    Insira o código de verificação enviado para o seu e-mail.
                  </p>
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                className="w-full"
              >
                Verificar
              </Button>
              <p className="text-muted-foreground text-sm text-center">
                Não recebeu o código? <Link to="#">Reenviar</Link>
              </p>
              <p className="text-muted-foreground text-sm text-center">
                <Link to="/login">Ir para o login</Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
