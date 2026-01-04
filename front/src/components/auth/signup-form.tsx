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

const signupSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      await registerUser(data.name, data.email, data.password)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch {
      toast.error('Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                control={form.control}
                name="name"
                label="Nome completo"
                placeholder="João da Silva"
              />
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
                placeholder="********"
                description="Mínimo 8 caracteres"
              />
              <FormInput
                control={form.control}
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                placeholder="********"
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  className="w-full"
                >
                  Cadastrar
                </Button>
                <p className="text-muted-foreground text-sm text-center">
                  Já possui uma conta? <Link to="/login">Entrar</Link>
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
