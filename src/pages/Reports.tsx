import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/store/useStore'
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns'
import { Clock, Flame, Target, TrendingUp } from 'lucide-react'

const COLORS = ['#ff6905', '#a805ff', '#fbbf24', '#22c55e', '#3b82f6']

export function Reports() {
  const { sessions, tasks } = useStore()

  // Last 7 days data
  const last7DaysData = useMemo(() => {
    const today = startOfDay(new Date())
    const days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    })

    return days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const daySessions = sessions.filter(
        (s) =>
          format(new Date(s.completedAt), 'yyyy-MM-dd') === dayStr &&
          s.type === 'focus'
      )

      return {
        date: format(day, 'EEE'),
        fullDate: format(day, 'MMM d'),
        pomodoros: daySessions.length,
        focusTime: Math.round(
          daySessions.reduce((acc, s) => acc + s.duration, 0) / 60
        ),
      }
    })
  }, [sessions])

  // Task distribution by pomodoros
  const taskDistribution = useMemo(() => {
    const tasksWithPomodoros = tasks
      .filter((t) => t.pomodorosSpent > 0)
      .sort((a, b) => b.pomodorosSpent - a.pomodorosSpent)
      .slice(0, 5)

    return tasksWithPomodoros.map((task) => ({
      name: task.title.length > 20 ? task.title.slice(0, 20) + '...' : task.title,
      value: task.pomodorosSpent,
    }))
  }, [tasks])

  // Overall stats
  const overallStats = useMemo(() => {
    const focusSessions = sessions.filter((s) => s.type === 'focus')
    const totalPomodoros = focusSessions.length
    const totalFocusTime = focusSessions.reduce((acc, s) => acc + s.duration, 0)
    const completedTasks = tasks.filter((t) => t.completed).length
    const avgPomodorosPerDay =
      last7DaysData.length > 0
        ? Math.round(
            last7DaysData.reduce((acc, d) => acc + d.pomodoros, 0) /
              last7DaysData.length
          )
        : 0

    return {
      totalPomodoros,
      totalFocusTime: Math.round(totalFocusTime / 60),
      completedTasks,
      avgPomodorosPerDay,
    }
  }, [sessions, tasks, last7DaysData])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Track your productivity and see your progress over time.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Total Pomodoros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">
              {overallStats.totalPomodoros}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              Total Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">
              {overallStats.totalFocusTime}m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-chart-4" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">
              {overallStats.completedTasks}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-chart-5" />
              Avg/Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-mono font-black">
              {overallStats.avgPomodorosPerDay}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="tasks">Task Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pomodoros Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  Daily Pomodoros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7DaysData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#0a0a0a', strokeWidth: 2 }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#0a0a0a', strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{
                          border: '3px solid #0a0a0a',
                          boxShadow: '4px 4px 0 #0a0a0a',
                          borderRadius: 0,
                        }}
                        labelFormatter={(label, payload) =>
                          payload?.[0]?.payload?.fullDate || label
                        }
                      />
                      <Bar
                        dataKey="pomodoros"
                        fill="#ff6905"
                        stroke="#0a0a0a"
                        strokeWidth={2}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Focus Time Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  Daily Focus Time (minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last7DaysData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#0a0a0a', strokeWidth: 2 }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: '#0a0a0a', strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{
                          border: '3px solid #0a0a0a',
                          boxShadow: '4px 4px 0 #0a0a0a',
                          borderRadius: 0,
                        }}
                        labelFormatter={(label, payload) =>
                          payload?.[0]?.payload?.fullDate || label
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="focusTime"
                        stroke="#a805ff"
                        strokeWidth={3}
                        dot={{ fill: '#a805ff', stroke: '#0a0a0a', strokeWidth: 2, r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Pomodoros by Task (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {taskDistribution.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No task data yet. Complete some pomodoros to see distribution.
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#0a0a0a"
                        strokeWidth={2}
                      >
                        {taskDistribution.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          border: '3px solid #0a0a0a',
                          boxShadow: '4px 4px 0 #0a0a0a',
                          borderRadius: 0,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
