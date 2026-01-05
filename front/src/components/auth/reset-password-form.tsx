import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
import { AlertTriangle, CheckCircle } from 'lucide-react'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isSuccess, setIsSuccess] = useState(false)

  const token = searchParams.get('token')
  const [isInvalidToken, setIsInvalidToken] = useState(!token)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return

    try {
      await authService.resetPassword({ token, password: data.password })
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 10000)
    } catch {
      toast.error('Token inválido ou expirado. Solicite um novo link.')
      setIsInvalidToken(true)
    }
  }

  if (isInvalidToken) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-xl">Link inválido</CardTitle>
          <CardDescription>
            O link de redefinição é inválido ou expirou. Solicite um novo link.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/esqueci-minha-senha">
            <Button className="w-full">Solicitar novo link</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-xl">Senha redefinida!</CardTitle>
          <CardDescription>
            Sua senha foi alterada com sucesso. Você será redirecionado para o
            login em instantes...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Ir para o login
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
          <CardTitle className="text-xl">Redefinir senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                control={form.control}
                name="password"
                label="Nova senha"
                type="password"
                placeholder="********"
                description="Mínimo 8 caracteres"
              />
              <FormInput
                control={form.control}
                name="confirmPassword"
                label="Confirmar senha"
                type="password"
                placeholder="********"
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  className="w-full"
                >
                  Redefinir senha
                </Button>
                <p className="text-muted-foreground text-sm text-center">
                  <Link to="/login">Voltar para o login</Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
