import { useState } from 'react'
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
import { Form } from '@/components/ui/form'
import { FormInput } from '@/components/ui/form-input'
import { authService } from '@/services'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data)
      setIsSubmitted(true)
    } catch {
      toast.error('Erro ao processar solicitação. Tente novamente.')
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-xl">E-mail enviado!</CardTitle>
          <CardDescription>
            Se o e-mail <strong> {form.getValues('email')}</strong> existir em
            nossa base de dados, você receberá um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Voltar para o login
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Digite seu e-mail para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                control={form.control}
                name="email"
                label="E-mail"
                type="email"
                placeholder="email@exemplo.com"
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  className="w-full"
                >
                  Enviar link de redefinição
                </Button>
                <p className="text-muted-foreground text-sm text-center">
                  Lembrou a senha? <Link to="/login">Fazer login</Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
