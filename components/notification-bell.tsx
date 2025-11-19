'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card } from '@/components/ui/card'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkReminders = () => {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]')
      const currentTime = new Date()
      const newNotifications: any[] = []

      todos.forEach((todo: any) => {
        if (todo.completed) return

        const todoDate = new Date(todo.date)
        const reminderTime = new Date(todoDate)
        reminderTime.setHours(reminderTime.getHours() - 1)

        // Check if it's within the reminder window (1 hour before)
        const timeDiff = reminderTime.getTime() - currentTime.getTime()
        const isReminderTime = timeDiff >= -60000 && timeDiff <= 0 // Within 1 hour before

        if (isReminderTime && !todo.reminderShown) {
          newNotifications.push({
            id: todo.id,
            type: 'reminder',
            title: todo.title,
            category: todo.category,
            message: `提醒: ${todo.title} 即将在大约1小时内到来！`,
            timestamp: currentTime,
          })

          // Mark reminder as shown
          todo.reminderShown = true
        }
      })

      if (newNotifications.length > 0) {
        localStorage.setItem('todos', JSON.stringify(todos))
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 10))
        setUnreadCount(prev => prev + newNotifications.length)
      }
    }

    checkReminders()
    const interval = setInterval(checkReminders, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const handleClearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">通知</h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearNotifications}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                全部清除
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              暂无通知
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <Card key={notif.id} className="p-3 bg-secondary/10">
                  <p className="text-sm font-medium text-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notif.timestamp).toLocaleTimeString('zh-CN')}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
