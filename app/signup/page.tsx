'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('密码不匹配')
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('密码至少需要6个字符')
        setIsLoading(false)
        return
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.find((u: any) => u.email === formData.email)) {
        setError('该邮箱已被注册')
        setIsLoading(false)
        return
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify(newUser))

      router.push('/')
    } catch (err) {
      setError('发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">TodoNow</h1>
            <p className="text-muted-foreground">创建您的账户</p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">姓名</label>
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">邮箱</label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">密码</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">确认密码</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? '创建中...' : '注册'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              已有账户?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                登录
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
