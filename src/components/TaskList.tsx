import { useState } from 'react'
import { Plus, Trash2, Target, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

interface TaskListProps {
  compact?: boolean
}

export function TaskList({ compact = false }: TaskListProps) {
  const { tasks, addTask, toggleTask, deleteTask, currentTaskId, setCurrentTask } =
    useStore()
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      const newTaskId = addTask(newTaskTitle.trim())
      setCurrentTask(newTaskId)
      setNewTaskTitle('')
    }
  }

  const incompleteTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  if (compact) {
    return (
      <Card className="taskListCard">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Current Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              placeholder="Write Task ID"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 h-9 text-sm"
            />
            <Button type="submit" size="sm" disabled={!newTaskTitle.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          {incompleteTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          ) : (
            <div className="space-y-2">
              {incompleteTasks.slice(0, 3).map((task) => (
                <button
                  key={task.id}
                  onClick={() => setCurrentTask(task.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 border-2 border-foreground transition-all text-sm font-medium',
                    currentTaskId === task.id
                      ? 'bg-primary text-primary-foreground shadow-[2px_2px_0_0_#0a0a0a]'
                      : 'bg-background hover:bg-muted'
                  )}
                >
                  {task.title}
                  {task.pomodorosSpent > 0 && (
                    <span className="ml-2 text-xs opacity-70">
                      ({task.pomodorosSpent} pomodoros)
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-3">
        <Input
          placeholder="What are you working on?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!newTaskTitle.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>

      {/* Incomplete Tasks */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          To Do ({incompleteTasks.length})
        </h3>
        {incompleteTasks.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center border-3 border-dashed border-muted">
            No tasks yet. Add one above!
          </p>
        ) : (
          <div className="space-y-2">
            {incompleteTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-4 p-4 border-3 border-foreground bg-background transition-all',
                  currentTaskId === task.id && 'shadow-[4px_4px_0_0_#ff6905] border-primary'
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {task.pomodorosSpent} pomodoros
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={currentTaskId === task.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setCurrentTask(currentTaskId === task.id ? null : task.id)
                    }
                  >
                    <Target className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 border-3 border-muted bg-muted/50"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate line-through text-muted-foreground">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {task.pomodorosSpent} pomodoros
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
