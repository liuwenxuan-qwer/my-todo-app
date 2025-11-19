'use client'

import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TodoList from '@/components/todo-list'
import AddTodoDialog from '@/components/add-todo-dialog'
import TodaysTasks from '@/components/todays-tasks-widget'
import { ArrowDownUp } from 'lucide-react'

export default function MainDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [todos, setTodos] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [sortByPriority, setSortByPriority] = useState(false)

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
    window.dispatchEvent(new Event('todosUpdated'))
  }, [todos])

  const getDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getTodosForDate = (date: Date) => {
    const dateStr = getDateString(date)
    return todos.filter(todo => todo.date === dateStr)
  }

  const handleAddTodo = (newTodo: any) => {
    const dateStr = getDateString(selectedDate)
    const todoWithDate = {
      ...newTodo,
      id: Math.random().toString(36).substr(2, 9),
      date: dateStr,
      completed: false,
      reminderShown: false,
    }
    setTodos([...todos, todoWithDate])
    setIsAddDialogOpen(false)
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const todosForSelectedDate = getTodosForDate(selectedDate)
  const priorityOrder = ['highest', 'high', 'medium', 'low', 'lowest']
  const displayedTodos = sortByPriority
    ? [...todosForSelectedDate].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1
        }
        const aIndex = priorityOrder.indexOf(a.priority)
        const bIndex = priorityOrder.indexOf(b.priority)
        return aIndex - bIndex
      })
    : [...todosForSelectedDate].sort((a, b) => {
        return a.completed ? 1 : -1
      })

  const dateStr = selectedDate.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Calendar and Today's Tasks */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-4">日历</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-lg"
            />
          </Card>

          <TodaysTasks />
        </div>

        {/* Main Content - Todo List */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{dateStr}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {todosForSelectedDate.length} 个任务
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSortByPriority(!sortByPriority)}
                  variant={sortByPriority ? "default" : "outline"}
                  className={sortByPriority ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border-primary text-primary hover:bg-primary/10"}
                >
                  <ArrowDownUp className="w-4 h-4 mr-2" />
                  {sortByPriority ? '按优先级排序中' : '按优先级排序'}
                </Button>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  + 添加任务
                </Button>
              </div>
            </div>

            <TodoList
              todos={displayedTodos}
              onDelete={handleDeleteTodo}
              onToggleComplete={handleToggleComplete}
            />
          </Card>
        </div>
      </div>

      <AddTodoDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddTodo}
      />
    </div>
  )
}
