import { DashboardPage } from "@/pages/Dashboard"
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
  // Add more private routes here:
  // {
  //   path: "/modulo/item-1",
  //   title: "Item 1",
  //   component: Item1Page,
  // },
]

// Helper to get title from path
export function getPageTitle(pathname: string): string {
  const route = PRIVATE_ROUTES.find((r) => r.path === pathname)
  return route?.title || "Dashboard"
}
