import { TaskList } from '@/components/TaskList'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Clock, Flame } from 'lucide-react'

export function Tasks() {
  const { tasks, getTodayStats } = useStore()
  const todayStats = getTodayStats()

  const incompleteTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)
  const totalPomodoros = tasks.reduce((acc, t) => acc + t.pomodorosSpent, 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Manage your tasks and track your progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Circle className="h-4 w-4 text-primary" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">{incompleteTasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-chart-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">{completedTasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Pomodoros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">{totalPomodoros}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">
              {Math.floor(todayStats.focusTime / 60)}m
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <TaskList />
    </div>
  )
}
