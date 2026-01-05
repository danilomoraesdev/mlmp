import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const CARDS_DATA = [
  {
    id: 'revenue',
    title: 'Receita Total',
    value: 'R$ 1.250,00',
    badge: 12.5,
    footerTitle: 'Em alta este mês',
    footerDescription: 'Visitantes nos últimos 6 meses',
  },
  {
    id: 'customers',
    title: 'Novos Clientes',
    value: '1.234',
    badge: -20,
    footerTitle: 'Queda de 20% neste período',
    footerDescription: 'Aquisição precisa de atenção',
  },
  {
    id: 'accounts',
    title: 'Contas Ativas',
    value: '45.678',
    badge: 12.5,
    footerTitle: 'Forte retenção de usuários',
    footerDescription: 'Engajamento acima das metas',
  },
  {
    id: 'growth',
    title: 'Taxa de Crescimento',
    value: '4,5%',
    badge: 4.5,
    footerTitle: 'Aumento constante de desempenho',
    footerDescription: 'Atende às projeções de crescimento',
  },
]

export function SectionCards() {
  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {CARDS_DATA.map((card) => {
        const TrendIcon = card.badge > 0 ? IconTrendingUp : IconTrendingDown
        return (
          <Card key={card.id} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {card.badge > 0 ? `+${card.badge}` : card.badge}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footerTitle} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {card.footerDescription}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
