export interface Task {
  id: string
  title: string
  completed: boolean
  pomodorosSpent: number
  tags: string[]
  createdAt: Date
  completedAt?: Date
}

export interface PomodoroSession {
  id: string
  taskId?: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  completedAt: Date
}

export interface TimerSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  pomodorosUntilLongBreak: number
  startSound: string
  endSound: string
}

export interface DailyStats {
  date: string
  completedPomodoros: number
  totalFocusTime: number
  tasksCompleted: number
}

export type TimerState = 'idle' | 'running' | 'paused'
export type SessionType = 'focus' | 'short-break' | 'long-break'
