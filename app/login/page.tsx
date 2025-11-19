'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        setError('邮箱或密码错误')
        setIsLoading(false)
        return
      }

      localStorage.setItem('currentUser', JSON.stringify(user))
      router.push('/')
    } catch (err) {
      setError('发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">TodoNow</h1>
            <p className="text-muted-foreground">欢迎回来！</p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">邮箱</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">密码</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              还没有账户?{' '}
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                注册
              </Link>
            </p>
          </div>

          {/* Demo account info */}
          <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-secondary/50">
            <p className="text-xs font-semibold text-foreground mb-2">演示账户:</p>
            <p className="text-xs text-muted-foreground">邮箱: demo@todo.com</p>
            <p className="text-xs text-muted-foreground">密码: demo123</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
