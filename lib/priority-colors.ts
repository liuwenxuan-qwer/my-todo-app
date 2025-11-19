export const priorityLevels = ['lowest', 'low', 'medium', 'high', 'highest'] as const
export type PriorityLevel = typeof priorityLevels[number]

export const priorityLabels: Record<PriorityLevel, string> = {
  lowest: '最低',
  low: '较低',
  medium: '中',
  high: '较高',
  highest: '最高',
}

export const priorityColors: Record<PriorityLevel, string> = {
  lowest: 'bg-red-100 text-red-600 border-red-200',
  low: 'bg-red-200 text-red-700 border-red-300',
  medium: 'bg-red-300 text-red-800 border-red-400',
  high: 'bg-red-400 text-red-900 border-red-500',
  highest: 'bg-red-600 text-white border-red-700',
}
