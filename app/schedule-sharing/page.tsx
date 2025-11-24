'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import OrganizationSelector from '@/components/organization-selector'
import MemberList from '@/components/member-list'
import ScheduleCalendarView from '@/components/schedule-calendar-view'

interface Organization {
  id: string
  name: string
  inviteCode: string
  createdBy: string
  createdAt: string
  members: string[]
  isAdmin?: boolean
}

interface Member {
  id: string
  name: string
  email: string
  isAdmin?: boolean
  isOnline?: boolean
  todayPublicEvents?: number
  joinedAt: string
}

export default function ScheduleSharingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [filterMode, setFilterMode] = useState(false)
  const [allMembersData, setAllMembersData] = useState<{ [email: string]: any[] }>({})
  const [isLoading, setIsLoading] = useState(true)

  const getDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const loadAllUsersData = () => {
    const users = localStorage.getItem('users')
    if (!users) return {}

    const parsedUsers = JSON.parse(users)
    const usersData: { [email: string]: any[] } = {}

    // 初始化所有用户的数据结构
    if (Array.isArray(parsedUsers)) {
      parsedUsers.forEach((user: any) => {
        usersData[user.email] = []
      })
    } else {
      // 兼容旧格式（对象格式）
      Object.keys(parsedUsers).forEach((email) => {
        usersData[email] = []
      })
    }

    // 从 localStorage 读取所有任务，按 userEmail 分组
    const allTodos = localStorage.getItem('todos')
    if (allTodos) {
      const todos = JSON.parse(allTodos)
      todos.forEach((todo: any) => {
        // 如果任务有 userEmail 字段，按用户分组
        if (todo.userEmail) {
          if (!usersData[todo.userEmail]) {
            usersData[todo.userEmail] = []
          }
          usersData[todo.userEmail].push(todo)
        } else {
          // 兼容旧数据：没有 userEmail 的任务分配给当前用户
          const currentUser = localStorage.getItem('currentUser')
          if (currentUser) {
            const user = JSON.parse(currentUser)
            if (!usersData[user.email]) {
              usersData[user.email] = []
            }
            usersData[user.email].push(todo)
          }
        }
      })
    }

    return usersData
  }

  const updateMembersWithRealData = (org: Organization) => {
    const usersData = loadAllUsersData()
    const today = getDateString(new Date())

    const updatedMembers: Member[] = org.members.map(email => {
      const tasks = usersData[email] || []
      const todayTasks = tasks.filter((t: any) => t.date === today && (t.category === 'work' || t.category === 'social'))

      return {
        id: email,
        name: email.split('@')[0],
        email: email,
        isAdmin: org.createdBy === email,
        isOnline: Math.random() > 0.3,
        todayPublicEvents: todayTasks.length,
        joinedAt: new Date().toISOString(),
      }
    })

    setMembers(updatedMembers)
    setAllMembersData(usersData)
  }

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
    } else {
      setUser(JSON.parse(currentUser))
      initializeOrganizations()
    }
  }, [router])

  useEffect(() => {
    const handleTodosUpdated = () => {
      if (currentOrg) {
        updateMembersWithRealData(currentOrg)
      }
    }

    window.addEventListener('todosUpdated', handleTodosUpdated)
    return () => window.removeEventListener('todosUpdated', handleTodosUpdated)
  }, [currentOrg])

  const initializeOrganizations = () => {
    const stored = localStorage.getItem('userOrganizations')
    const orgs: Organization[] = stored ? JSON.parse(stored) : []

    if (orgs.length === 0) {
      const demoOrg: Organization = {
        id: 'demo-org-1',
        name: '演示组织',
        inviteCode: 'DEMO123',
        createdBy: 'demo@todo.com',
        createdAt: new Date().toISOString(),
        members: ['demo@todo.com'],
      }
      orgs.push(demoOrg)
      localStorage.setItem('userOrganizations', JSON.stringify(orgs))
    }

    setOrganizations(orgs)
    if (orgs.length > 0) {
      handleSelectOrg(orgs[0])
    }
    setIsLoading(false)
  }

  const handleSelectOrg = (org: Organization) => {
    setCurrentOrg(org)
    setSelectedMembers(new Set())
    setFilterMode(false)
    updateMembersWithRealData(org)
  }

  const handleCreateOrg = (name: string, inviteCode: string) => {
    const newOrg: Organization = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      inviteCode,
      createdBy: user?.email || 'unknown',
      createdAt: new Date().toISOString(),
      members: [user?.email],
      isAdmin: true,
    }

    const updated = [...organizations, newOrg]
    setOrganizations(updated)
    localStorage.setItem('userOrganizations', JSON.stringify(updated))
    handleSelectOrg(newOrg)
  }

  const handleJoinOrg = (inviteCode: string) => {
    const org = organizations.find((o) => o.inviteCode === inviteCode)
    if (org && !org.members.includes(user?.email)) {
      org.members.push(user?.email)
      const updated = [...organizations]
      setOrganizations(updated)
      localStorage.setItem('userOrganizations', JSON.stringify(updated))
      handleSelectOrg(org)
    }
  }

  const handleSelectMember = (memberId: string, selected: boolean) => {
    const updated = new Set(selectedMembers)
    if (selected) {
      updated.add(memberId)
    } else {
      updated.delete(memberId)
    }
    setSelectedMembers(updated)
  }

  const handleToggleAllMembers = (selected: boolean) => {
    if (selected) {
      setSelectedMembers(new Set(members.map((m) => m.id)))
    } else {
      setSelectedMembers(new Set())
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">日程分享</h1>
          <p className="text-muted-foreground mt-2">与团队协作管理日程</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]">
          {/* 左上：组织管理 */}
          <div className="lg:col-span-1">
            <OrganizationSelector
              organizations={organizations}
              currentOrg={currentOrg}
              onSelectOrg={handleSelectOrg}
              onCreateOrg={handleCreateOrg}
              onJoinOrg={handleJoinOrg}
            />
          </div>

          {/* 左下：成员列表 */}
          <div className="lg:col-span-1">
            {currentOrg ? (
              <MemberList
                members={members}
                selectedMembers={selectedMembers}
                onSelectMember={handleSelectMember}
                onToggleAllMembers={handleToggleAllMembers}
                filterMode={filterMode}
                onToggleFilterMode={setFilterMode}
              />
            ) : (
              <div className="bg-card rounded-lg border border-border h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">请先选择组织</p>
              </div>
            )}
          </div>

          {/* 右侧：日历区 */}
          <div className="lg:col-span-2">
            <ScheduleCalendarView
              allMembersData={allMembersData}
              selectedMembers={selectedMembers}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
