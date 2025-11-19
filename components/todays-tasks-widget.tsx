'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle } from 'lucide-react'
import { priorityColors } from '@/lib/priority-colors'

const categoryColors = {
  work: 'bg-work-light text-work-primary',
  social: 'bg-social-light text-social-primary',
  family: 'bg-family-light text-family-primary',
  learning: 'bg-learning-light text-learning-primary',
}

export default function TodaysTasks() {
  const [todaysTodos, setTodaysTodos] = useState<any[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  const updateTodaysTasks = () => {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]')
    const today = new Date().toISOString().split('T')[0]
    const todaysItems = todos.filter((todo: any) => todo.date === today)
    setTodaysTodos(todaysItems)
    setCompletedCount(todaysItems.filter((t: any) => t.completed).length)
  }

  useEffect(() => {
    updateTodaysTasks()

    window.addEventListener('storage', updateTodaysTasks)
    
    window.addEventListener('todosUpdated', updateTodaysTasks)

    return () => {
      window.removeEventListener('storage', updateTodaysTasks)
      window.removeEventListener('todosUpdated', updateTodaysTasks)
    }
  }, [])

  if (todaysTodos.length === 0) {
    return (
      <Card className="p-4 bg-secondary/10 border-secondary/30">
        <h3 className="font-semibold text-foreground mb-2">今日任务</h3>
        <p className="text-muted-foreground text-sm">今天还没有安排任务</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-secondary/10 border-secondary/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">今日任务</h3>
        <Badge variant="outline" className="bg-background">
          {completedCount}/{todaysTodos.length}
        </Badge>
      </div>

      <div className="space-y-2">
        {todaysTodos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2">
            <div className={todo.completed ? 'text-primary' : 'text-muted-foreground'}>
              {todo.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                todo.completed
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}>
                {todo.title}
              </p>
            </div>
            <Badge className={`border text-xs ${priorityColors[todo.priority as keyof typeof priorityColors] || priorityColors['medium']}`}>
              {todo.priority}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
