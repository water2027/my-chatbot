'use client'

import { Coins, LogIn, LogOut, Moon, Sun, User } from 'lucide-react'

import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User as UserProfile } from '@supabase/supabase-js'

interface AvatarSectionProps {
  userProfile: UserProfile | null
  balance: number
  onLoginClick?: () => void
  onLogoutClick?: () => void
}

export default function AvatarSection({
  onLoginClick,
  onLogoutClick,
  userProfile,
  balance,
}: AvatarSectionProps) {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center gap-2">
      {/* 明暗模式切换按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 rounded-full"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* 用户头像下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback
                className={`text-xs font-bold transition-colors ${
                  userProfile
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            {/* 在线状态指示器 */}
            <Badge
              className={`absolute -bottom-0 -right-0 h-3 w-3 rounded-full border-2 border-background p-0 ${
                userProfile
                  ? 'bg-green-500 hover:bg-green-500'
                  : 'bg-muted-foreground hover:bg-muted-foreground'
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="text-sm font-medium">
                {userProfile ? '已登录' : '未登录'}
              </p>
              <p className="text-xs text-muted-foreground">
                {userProfile ? '当前在线状态' : '点击登录'}
              </p>
            </div>
          </div>

          {/* Token 显示区域 */}
          {userProfile && (
            <>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-start gap-2 p-2">
                <Coins className="h-4 w-4 text-amber-500" />
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="text-sm font-medium">token余额</p>
                  <p className="text-xs text-muted-foreground">
                    {balance}
                  </p>
                </div>
              </div>
            </>
          )}

          <DropdownMenuSeparator />

          {userProfile
            ? (
                <DropdownMenuItem onClick={onLogoutClick} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>登出</span>
                </DropdownMenuItem>
              )
            : (
                <DropdownMenuItem onClick={onLoginClick}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>登录</span>
                </DropdownMenuItem>
              )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
