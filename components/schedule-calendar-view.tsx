'use client'

import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, CalendarDays, CalendarMinus as CalendarMonth } from 'lucide-react'

interface Task {
  id: string
  title: string
  date: string
  category: 'work' | 'social' | 'family' | 'learning'
  priority: 'lowest' | 'lower' | 'medium' | 'higher' | 'highest'
  completed: boolean
  time?: string
}

interface MemberTask {
  name: string
  tasks: Task[]
}

export default function ScheduleCalendarView({
  allMembersData,
  selectedMembers,
}: {
  allMembersData: { [name: string]: Task[] }
  selectedMembers: Set<string>
}) {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const getDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const dates = []
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    return dates
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      work: 'bg-blue-100 text-blue-800',
      social: 'bg-purple-100 text-purple-800',
      family: 'bg-orange-100 text-orange-800',
      learning: 'bg-green-100 text-green-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      work: '工作',
      social: '社交',
      family: '家庭',
      learning: '学习',
    }
    return labels[category] || category
  }

  // 只显示工作和社交类别
  const isShareableCategory = (category: string) => {
    return category === 'work' || category === 'social'
  }

  const displayedMembers = useMemo(() => {
    if (selectedMembers.size === 0) return {}
    
    const result: { [key: string]: Task[] } = {}
    selectedMembers.forEach(memberId => {
      const tasks = allMembersData[memberId] || []
      result[memberId] = tasks.filter(task => isShareableCategory(task.category))
    })
    return result
  }, [allMembersData, selectedMembers])

  const getTasksForDateRange = (dates: Date[]) => {
    const result: { [dateStr: string]: MemberTask[] } = {}
    
    dates.forEach(date => {
      const dateStr = getDateString(date)
      result[dateStr] = []
      
      Object.entries(displayedMembers).forEach(([memberId, tasks]) => {
        const dayTasks = tasks.filter(t => t.date === dateStr && !t.completed)
        if (dayTasks.length > 0) {
          result[dateStr].push({
            name: memberId,
            tasks: dayTasks.sort((a, b) => {
              const timeA = a.time || '00:00'
              const timeB = b.time || '00:00'
              return timeA.localeCompare(timeB)
            }),
          })
        }
      })
    })
    
    return result
  }

  const renderDayView = () => {
    const dateStr = getDateString(selectedDate)
    const tasksData = getTasksForDateRange([selectedDate])
    const dayTasks = tasksData[dateStr] || []
    const dateDisplay = selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })

    return (
      <div className="space-y-4">
        <div className="text-sm font-semibold text-foreground mb-3">{dateDisplay}</div>
        
        <div className="space-y-2">
          {dayTasks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              暂无日程
            </div>
          ) : (
            dayTasks.map((memberData, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-semibold text-foreground px-2 py-1">{memberData.name}</div>
                {memberData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 bg-secondary/50 rounded text-xs hover:bg-secondary transition-colors"
                  >
                    {task.time && <span className="text-muted-foreground min-w-fit">{task.time}</span>}
                    <span className="truncate flex-1">{task.title}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {getCategoryLabel(task.category)}
                    </Badge>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates(selectedDate)
    const tasksData = getTasksForDateRange(weekDates)
    const allWeekTasks: Array<{ date: string; dateDisplay: string; isToday: boolean; memberData: MemberTask }> = []

    weekDates.forEach((date) => {
      const dateStr = getDateString(date)
      const dayTasks = tasksData[dateStr] || []
      const dateDisplay = date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' })
      const isToday = getDateString(new Date()) === dateStr

      dayTasks.forEach((memberData) => {
        allWeekTasks.push({ date: dateStr, dateDisplay, isToday, memberData })
      })
    })

    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* 周一到周日日期选择 */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weekDates.map((date) => {
            const dateStr = getDateString(date)
            const isSelected = getDateString(selectedDate) === dateStr
            const dayName = date.toLocaleDateString('zh-CN', { weekday: 'short' })
            const dayNum = date.getDate()

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/50 text-foreground border-border hover:bg-secondary'
                }`}
              >
                <span className="text-xs font-medium">{dayName}</span>
                <span className="text-sm font-semibold">{dayNum}</span>
              </button>
            )
          })}
        </div>

        {/* 成员事务展示列表 */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {allWeekTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              暂无日程
            </div>
          ) : (
            allWeekTasks.map((item, idx) => (
              <div key={idx} className={`p-2 rounded-lg border flex items-center gap-2 ${item.isToday ? 'bg-primary/10 border-primary/30' : 'bg-secondary/30 border-border'}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{item.memberData.name}</div>
                  <div className="text-xs text-muted-foreground">{item.dateDisplay}</div>
                </div>
                <div className="flex-1 min-w-0">
                  {item.memberData.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-1 text-xs truncate">
                      {task.time && <span className="text-muted-foreground min-w-fit">{task.time}</span>}
                      <span className="truncate text-foreground">{task.title}</span>
                    </div>
                  ))}
                </div>
                <Badge variant="outline" className="text-xs py-0 px-1.5 flex-shrink-0">
                  {getCategoryLabel(item.memberData.tasks[0]?.category || 'work')}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const monthDates = getMonthDates(selectedDate)
    const tasksData = getTasksForDateRange(monthDates)
    const allMonthTasks: Array<{ date: string; dateDisplay: string; isToday: boolean; memberData: MemberTask }> = []

    monthDates.forEach((date) => {
      const dateStr = getDateString(date)
      const dayTasks = tasksData[dateStr] || []
      const dateDisplay = date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
      const isToday = getDateString(new Date()) === dateStr

      dayTasks.forEach((memberData) => {
        allMonthTasks.push({ date: dateStr, dateDisplay, isToday, memberData })
      })
    })

    return (
      <div className="space-y-4 h-full flex flex-col">
        <div className="w-full" style={{ aspectRatio: '2 / 1' }}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-lg border border-border p-1 w-full h-full"
          />
        </div>

        {/* 成员事务展示列表 */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {allMonthTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              暂无日程
            </div>
          ) : (
            allMonthTasks.map((item, idx) => (
              <div key={idx} className={`p-2 rounded-lg border flex items-center gap-2 ${item.isToday ? 'bg-primary/10 border-primary/30' : 'bg-secondary/30 border-border'}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{item.memberData.name}</div>
                  <div className="text-xs text-muted-foreground">{item.dateDisplay}</div>
                </div>
                <div className="flex-1 min-w-0">
                  {item.memberData.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-1 text-xs truncate">
                      {task.time && <span className="text-muted-foreground min-w-fit">{task.time}</span>}
                      <span className="truncate text-foreground">{task.title}</span>
                    </div>
                  ))}
                </div>
                <Badge variant="outline" className="text-xs py-0 px-1.5 flex-shrink-0">
                  {getCategoryLabel(item.memberData.tasks[0]?.category || 'work')}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="p-4 flex flex-col h-full">
      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as any)}
        className="w-full flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="day" className="text-xs">
            <CalendarIcon className="w-3 h-3 mr-1" />
            当天
          </TabsTrigger>
          <TabsTrigger value="week" className="text-xs">
            <CalendarDays className="w-3 h-3 mr-1" />
            周
          </TabsTrigger>
          <TabsTrigger value="month" className="text-xs">
            <CalendarMonth className="w-3 h-3 mr-1" />
            月
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="day" className="mt-0 h-full overflow-auto">
            {renderDayView()}
          </TabsContent>

          <TabsContent value="week" className="mt-0 h-full overflow-auto">
            {renderWeekView()}
          </TabsContent>

          <TabsContent value="month" className="mt-0 h-full overflow-auto">
            {renderMonthView()}
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}
