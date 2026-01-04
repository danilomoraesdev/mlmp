import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { getPageTitle } from '@/config/routes.config'
import { getInitials } from '@/lib/utils'

export function SiteHeader() {
  const location = useLocation()
  const { actualTheme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const pageTitle = getPageTitle(location.pathname)

  const toggleTheme = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-3">
          {user && (
            <div className="flex cursor-default items-center gap-2 px-2">
              <Avatar className="size-7">
                <AvatarFallback className="text-[10px]">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{user.name}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={toggleTheme}
          >
            {actualTheme === 'dark' ? <Sun /> : <Moon />}
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
