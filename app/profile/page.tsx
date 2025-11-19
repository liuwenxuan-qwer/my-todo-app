'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Navigation from '@/components/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
    } else {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setEditData(userData)
    }
    setIsLoading(false)
  }, [router])

  const handleSaveProfile = () => {
    // 保存编辑的用户信息到 localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex] = editData
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify(editData))
      setUser(editData)
      setIsEditing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData({
      ...editData,
      [field]: value,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="p-8">
          {/* 用户头像和基本信息 */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl font-bold text-primary">{user?.name?.[0]}</div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{user?.name}</h1>
            <p className="text-muted-foreground mt-2">{user?.email}</p>
          </div>

          {/* 用户信息详情 */}
          <div className="space-y-4 mb-8">
            {/* 加入时间 */}
            <div className="p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">加入时间</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(user?.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>

            {isEditing ? (
              <>
                {/* 编辑模式 */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">姓名</label>
                    <Input
                      value={editData?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">邮箱</label>
                    <Input
                      type="email"
                      value={editData?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">电话</label>
                    <Input
                      value={editData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-2"
                      placeholder="请输入电话号码"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">地址</label>
                    <Input
                      value={editData?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-2"
                      placeholder="请输入地址"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">职位</label>
                    <Input
                      value={editData?.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="mt-2"
                      placeholder="请输入职位"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">个人简介</label>
                    <textarea
                      value={editData?.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full mt-2 p-2 border border-input rounded-md text-foreground bg-background"
                      placeholder="请输入个人简介"
                      rows={3}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 查看模式 */}
                {user?.phone && (
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">电话</p>
                    <p className="text-lg font-semibold text-foreground">{user.phone}</p>
                  </div>
                )}

                {user?.address && (
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">地址</p>
                    <p className="text-lg font-semibold text-foreground">{user.address}</p>
                  </div>
                )}

                {user?.position && (
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">职位</p>
                    <p className="text-lg font-semibold text-foreground">{user.position}</p>
                  </div>
                )}

                {user?.bio && (
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">个人简介</p>
                    <p className="text-base text-foreground">{user.bio}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditData(user)
                    setIsEditing(false)
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  保存修改
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(true)}
                >
                  编辑信息
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/')}
                >
                  返回首页
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  退出登录
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
