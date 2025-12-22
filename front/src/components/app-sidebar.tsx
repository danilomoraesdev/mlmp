import {
  Sidebar,
  SidebarRail,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"

const data = {
  userNav: [
    {
      title: "Rede",
      url: "/rede",
      items: [
        {
          title: "Resumo",
          url: "/resumo",
        },
        {
          title: "Matriz",
          url: "/matriz",
          isActive: true,
        },
        {
          title: "Downline",
          url: "/downline",
        },
      ],
    },
    {
      title: "Sistema",
      url: "/sistema",
      items: [
        {
          title: "Minha Conta",
          url: "/minha-conta",
        },
        {
          title: "Financeiro",
          url: "/financeiro",
        },
        {
          title: "Configurações",
          url: "/configuracoes",
        },
        {
          title: "Sair",
          url: "/logout",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Logo />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">MLMP</span>
                  <span className="">Painel do usuário</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.userNav.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={`${group.url}${item.url}`}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
