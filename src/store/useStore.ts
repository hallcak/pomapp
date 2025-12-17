import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, PomodoroSession, TimerSettings, TimerState, SessionType } from '@/types'
import { generateId } from '@/lib/utils'

interface AppState {
  // Timer State
  timerState: TimerState
  currentSession: SessionType
  timeRemaining: number
  completedPomodoros: number
  currentTaskId: string | null

  // Settings
  settings: TimerSettings

  // Tasks
  tasks: Task[]

  // Sessions
  sessions: PomodoroSession[]

  // Timer Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  completeSession: () => void
  setCurrentTask: (taskId: string | null) => void

  // Settings Actions
  updateSettings: (settings: Partial<TimerSettings>) => void

  // Task Actions
  addTask: (title: string, tags?: string[]) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void

  // Utility
  getSessionDuration: (type: SessionType) => number
  getTodayStats: () => { pomodoros: number; focusTime: number; tasksCompleted: number }
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  pomodorosUntilLongBreak: 4,
  startSound: 'classic',
  endSound: 'bell',
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      timerState: 'idle',
      currentSession: 'focus',
      timeRemaining: DEFAULT_SETTINGS.focusDuration,
      completedPomodoros: 0,
      currentTaskId: null,
      settings: DEFAULT_SETTINGS,
      tasks: [],
      sessions: [],

      // Timer Actions
      startTimer: () => set({ timerState: 'running' }),

      pauseTimer: () => set({ timerState: 'paused' }),

      resetTimer: () => {
        const { currentSession, getSessionDuration } = get()
        set({
          timerState: 'idle',
          timeRemaining: getSessionDuration(currentSession),
        })
      },

      tick: () => {
        const { timeRemaining } = get()
        if (timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 })
        }
      },

      completeSession: () => {
        const { currentSession, completedPomodoros, settings, currentTaskId, tasks } = get()

        // Record session
        const session: PomodoroSession = {
          id: generateId(),
          taskId: currentTaskId || undefined,
          type: currentSession,
          duration: get().getSessionDuration(currentSession),
          completedAt: new Date(),
        }

        // Update task pomodoros if focus session
        let updatedTasks = tasks
        if (currentSession === 'focus' && currentTaskId) {
          updatedTasks = tasks.map((task) =>
            task.id === currentTaskId
              ? { ...task, pomodorosSpent: task.pomodorosSpent + 1 }
              : task
          )
        }

        // Determine next session
        let nextSession: SessionType
        let newCompletedPomodoros = completedPomodoros

        if (currentSession === 'focus') {
          newCompletedPomodoros = completedPomodoros + 1
          if (newCompletedPomodoros % settings.pomodorosUntilLongBreak === 0) {
            nextSession = 'long-break'
          } else {
            nextSession = 'short-break'
          }
        } else {
          nextSession = 'focus'
        }

        set({
          timerState: 'idle',
          currentSession: nextSession,
          timeRemaining: get().getSessionDuration(nextSession),
          completedPomodoros: newCompletedPomodoros,
          sessions: [...get().sessions, session],
          tasks: updatedTasks,
        })
      },

      setCurrentTask: (taskId) => set({ currentTaskId: taskId }),

      // Settings Actions
      updateSettings: (newSettings) => {
        const { settings, currentSession, timerState } = get()
        const updatedSettings = { ...settings, ...newSettings }
        set({ settings: updatedSettings })

        // Update timer if idle
        if (timerState === 'idle') {
          const duration =
            currentSession === 'focus'
              ? updatedSettings.focusDuration
              : currentSession === 'short-break'
                ? updatedSettings.shortBreakDuration
                : updatedSettings.longBreakDuration
          set({ timeRemaining: duration })
        }
      },

      // Task Actions
      addTask: (title, tags = []) => {
        const task: Task = {
          id: generateId(),
          title,
          completed: false,
          pomodorosSpent: 0,
          tags,
          createdAt: new Date(),
        }
        set({ tasks: [...get().tasks, task] })
      },

      toggleTask: (id) => {
        const { tasks } = get()
        set({
          tasks: tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed ? new Date() : undefined,
                }
              : task
          ),
        })
      },

      deleteTask: (id) => {
        const { tasks, currentTaskId } = get()
        set({
          tasks: tasks.filter((task) => task.id !== id),
          currentTaskId: currentTaskId === id ? null : currentTaskId,
        })
      },

      updateTask: (id, updates) => {
        const { tasks } = get()
        set({
          tasks: tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        })
      },

      // Utility
      getSessionDuration: (type) => {
        const { settings } = get()
        switch (type) {
          case 'focus':
            return settings.focusDuration
          case 'short-break':
            return settings.shortBreakDuration
          case 'long-break':
            return settings.longBreakDuration
        }
      },

      getTodayStats: () => {
        const { sessions, tasks } = get()
        const today = new Date().toDateString()

        const todaySessions = sessions.filter(
          (s) => new Date(s.completedAt).toDateString() === today
        )

        const pomodoros = todaySessions.filter((s) => s.type === 'focus').length
        const focusTime = todaySessions
          .filter((s) => s.type === 'focus')
          .reduce((acc, s) => acc + s.duration, 0)

        const tasksCompleted = tasks.filter(
          (t) => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
        ).length

        return { pomodoros, focusTime, tasksCompleted }
      },
    }),
    {
      name: 'pomapp-storage',
      partialize: (state) => ({
        settings: state.settings,
        tasks: state.tasks,
        sessions: state.sessions,
        completedPomodoros: state.completedPomodoros,
      }),
    }
  )
)
