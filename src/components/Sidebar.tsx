import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Timer, CheckSquare, BarChart3, Settings, Clock, Volume2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SOUND_OPTIONS, previewSound, type SoundType } from '@/lib/sounds'

const navItems = [
  { to: '/', icon: Timer, label: 'Timer' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
]

const PRESETS = [
  { label: 'Classic', focus: 25, shortBreak: 5, longBreak: 15 },
  { label: 'Extended', focus: 50, shortBreak: 10, longBreak: 30 },
  { label: 'Short Sprint', focus: 15, shortBreak: 3, longBreak: 10 },
]

export function Sidebar() {
  const { getTodayStats, settings, updateSettings } = useStore()
  const todayStats = getTodayStats()
  const [open, setOpen] = useState(false)

  const [focusMinutes, setFocusMinutes] = useState(25)
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5)
  const [longBreakMinutes, setLongBreakMinutes] = useState(15)
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4)
  const [startSound, setStartSound] = useState<SoundType>('classic')
  const [endSound, setEndSound] = useState<SoundType>('bell')

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFocusMinutes(Math.floor(settings.focusDuration / 60))
      setShortBreakMinutes(Math.floor(settings.shortBreakDuration / 60))
      setLongBreakMinutes(Math.floor(settings.longBreakDuration / 60))
      setPomodorosUntilLongBreak(settings.pomodorosUntilLongBreak)
      setStartSound(settings.startSound as SoundType)
      setEndSound(settings.endSound as SoundType)
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    updateSettings({
      focusDuration: focusMinutes * 60,
      shortBreakDuration: shortBreakMinutes * 60,
      longBreakDuration: longBreakMinutes * 60,
      pomodorosUntilLongBreak,
      startSound,
      endSound,
    })
    setOpen(false)
  }

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setFocusMinutes(preset.focus)
    setShortBreakMinutes(preset.shortBreak)
    setLongBreakMinutes(preset.longBreak)
  }

  return (
    <aside className="w-64 min-h-screen bg-background border-r-3 border-foreground p-6 flex flex-col">
      {/* Logo */}
      <NavLink to="/" className="block mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Pom<span className="text-primary">app</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
          Focus. Work. Repeat.
        </p>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm transition-all border-3 border-transparent',
                isActive
                  ? 'bg-primary text-primary-foreground border-foreground shadow-[4px_4px_0_0_#0a0a0a]'
                  : 'hover:bg-muted hover:border-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Today's Stats */}
      <div className="mt-auto pt-6 border-t-3 border-foreground">
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">
          Today's Progress
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pomodoros</span>
            <span className="font-mono font-bold text-primary text-lg">
              {todayStats.pomodoros}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Focus Time</span>
            <span className="font-mono font-bold text-secondary text-lg">
              {Math.floor(todayStats.focusTime / 60)}m
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tasks Done</span>
            <span className="font-mono font-bold text-lg">
              {todayStats.tasksCompleted}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button className="mt-6 flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
            <DialogDescription>
              Customize your pomodoro intervals and sounds.
            </DialogDescription>
          </DialogHeader>

          {/* Presets */}
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wide">
              Quick Presets
            </label>
            <div className="flex gap-2">
              {PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Settings */}
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Focus Duration (minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={120}
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                Short Break (minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Clock className="h-4 w-4 text-chart-4" />
                Long Break (minutes)
              </label>
              <Input
                type="number"
                min={1}
                max={60}
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wide">
                Pomodoros until Long Break
              </label>
              <Input
                type="number"
                min={2}
                max={10}
                value={pomodorosUntilLongBreak}
                onChange={(e) => setPomodorosUntilLongBreak(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-4 mt-6 pt-6 border-t-3 border-foreground">
            <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Sound Settings
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Sound</label>
              <div className="flex gap-2">
                <Select value={startSound} onValueChange={(v) => setStartSound(v as SoundType)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOUND_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.emoji} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => previewSound(startSound)}
                  disabled={startSound === 'none'}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Sound</label>
              <div className="flex gap-2">
                <Select value={endSound} onValueChange={(v) => setEndSound(v as SoundType)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOUND_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.emoji} {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => previewSound(endSound)}
                  disabled={endSound === 'none'}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
