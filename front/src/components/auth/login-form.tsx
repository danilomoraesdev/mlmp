import { Link, useNavigate } from 'react-router-dom'
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
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch {
      toast.error('Erro ao fazer login. Tente novamente.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo!</CardTitle>
          <CardDescription>Faça login com seu e-mail e senha</CardDescription>
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
              <FormInput
                control={form.control}
                name="password"
                label="Senha"
                type="password"
                labelExtra={
                  <Link
                    to="/esqueci-minha-senha"
                    className="text-muted-foreground text-sm"
                  >
                    Esqueceu sua senha?
                  </Link>
                }
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  className="w-full"
                >
                  Login
                </Button>
                <p className="text-muted-foreground text-sm text-center">
                  Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-xs px-6 text-center">
        Ao continuar, você concorda com nossos
        <br />
        <Link to="/termos">Termos de Serviço</Link> e{' '}
        <Link to="/privacidade">Política de Privacidade</Link>.
      </p>
    </>
  )
}
