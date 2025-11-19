'use client'

import { Trash2, CheckCircle, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { priorityLabels, priorityColors } from '@/lib/priority-colors'

interface Todo {
  id: string
  title: string
  description?: string
  category: 'work' | 'social' | 'family' | 'learning'
  priority: string
  completed: boolean
}

const categoryColors = {
  work: 'bg-work-light text-work-primary',
  social: 'bg-social-light text-social-primary',
  family: 'bg-family-light text-family-primary',
  learning: 'bg-learning-light text-learning-primary',
}

const categoryLabels: Record<string, string> = {
  work: '工作',
  social: '社交',
  family: '家庭',
  learning: '学习',
}

export default function TodoList({
  todos,
  onDelete,
  onToggleComplete,
}: {
  todos: Todo[]
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">这一天还没有任务</p>
        <p className="text-muted-foreground text-sm mt-1">添加一个开始吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <Card
          key={todo.id}
          className={`p-4 flex items-start gap-4 transition-all ${
            todo.completed ? 'bg-muted/50 opacity-60' : 'bg-card hover:shadow-md'
          }`}
        >
          {/* Completion Toggle */}
          <button
            onClick={() => onToggleComplete(todo.id)}
            className="flex-shrink-0 mt-1 text-muted-foreground hover:text-primary transition-colors"
          >
            {todo.completed ? (
              <CheckCircle className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-foreground ${
                todo.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`text-sm mt-1 ${todo.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                {todo.description}
              </p>
            )}
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge className={categoryColors[todo.category]}>
                {categoryLabels[todo.category]}
              </Badge>
              <Badge className={`border ${priorityColors[todo.priority as keyof typeof priorityColors] || priorityColors['medium']}`}>
                {priorityLabels[todo.priority as keyof typeof priorityLabels] || '中'}
              </Badge>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(todo.id)}
            className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </Card>
      ))}
    </div>
  )
}
