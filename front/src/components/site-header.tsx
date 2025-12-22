import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"

export function SiteHeader() {
  const { actualTheme, setTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={toggleTheme}
          >
            {actualTheme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
