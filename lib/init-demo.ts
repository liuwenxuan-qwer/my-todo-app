export function initializeDemoAccount() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  // Check if demo account already exists
  const demoExists = users.find((u: any) => u.email === 'demo@todo.com')
  
  if (!demoExists) {
    const demoUser = {
      id: 'demo-user-001',
      name: 'Demo User',
      email: 'demo@todo.com',
      password: 'demo123',
      phone: '13800138000',
      address: '北京市朝阳区',
      position: '产品经理',
      bio: '热爱制定计划和时间管理',
      createdAt: new Date().toISOString(),
    }
    
    users.push(demoUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Initialize some demo tasks for the demo account
    const demoTasks = [
      {
        id: 'task-1',
        userId: 'demo-user-001',
        title: 'Complete project proposal',
        description: 'Finish the Q1 project proposal',
        category: 'work',
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        userId: 'demo-user-001',
        title: 'Coffee with Sarah',
        description: 'Meet Sarah at the cafe',
        category: 'social',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-3',
        userId: 'demo-user-001',
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, vegetables',
        category: 'family',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-4',
        userId: 'demo-user-001',
        title: 'Learn TypeScript generics',
        description: 'Watch the tutorial and complete exercises',
        category: 'learning',
        priority: 'low',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]
    
    localStorage.setItem('demo-user-001-tasks', JSON.stringify(demoTasks))
  }
}
