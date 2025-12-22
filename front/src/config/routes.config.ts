import { DashboardPage } from "@/pages/Dashboard"
import { ExamplePage } from "@/pages/Example"
import type { ComponentType } from "react"

export interface RouteConfig {
  path: string
  title: string
  component: ComponentType
}

// Centralized route configuration - add new routes here
export const PRIVATE_ROUTES: RouteConfig[] = [
  {
    path: "/",
    title: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/modulo/pagina-1",
    title: "Página 1",
    component: ExamplePage,
  },
  {
    path: "/modulo/pagina-2",
    title: "Página 2",
    component: ExamplePage,
  },
  {
    path: "/modulo/pagina-3",
    title: "Página 3",
    component: ExamplePage,
  },
  {
    path: "/sistema/meu-perfil",
    title: "Meu Perfil",
    component: ExamplePage,
  },
  {
    path: "/sistema/configuracoes",
    title: "Configurações",
    component: ExamplePage,
  },
]

// Helper to get title from path
export function getPageTitle(pathname: string): string {
  const route = PRIVATE_ROUTES.find((r) => r.path === pathname)
  return route?.title || "Dashboard"
}
