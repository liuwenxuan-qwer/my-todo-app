'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import NotificationBell from '@/components/notification-bell'

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">TodoNow</div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setCurrentPage('dashboard')}
            >
              首页
            </Link>
            <Link
              href="/schedule-sharing"
              className={`text-sm font-medium transition-colors ${
                currentPage === 'schedule'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setCurrentPage('schedule')}
            >
              日程分享
            </Link>

            {user && <NotificationBell />}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  {user.name}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  退出登录
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  登录
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
