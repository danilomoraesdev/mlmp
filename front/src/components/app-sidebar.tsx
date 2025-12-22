import { useLocation } from "react-router-dom"
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
      title: "Módulo",
      url: "/modulo",
      items: [
        {
          title: "Item 1",
          url: "/item-1",
        },
        {
          title: "Item 2",
          url: "/item-2",
        },
        {
          title: "Item 3",
          url: "/item-3",
        },
      ],
    },
    {
      title: "Sistema",
      url: "/sistema",
      items: [
        {
          title: "Meu Perfil",
          url: "/meu-perfil",
        },
        {
          title: "Configurações",
          url: "/configuracoes",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

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
                {group.items.map((item) => {
                  const fullPath = `${group.url}${item.url}`
                  const isActive = location.pathname === fullPath
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={fullPath}>{item.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
