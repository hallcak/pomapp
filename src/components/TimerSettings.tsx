import { useState } from 'react'
import { Settings, Clock, Volume2, Play } from 'lucide-react'
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
import { useStore } from '@/store/useStore'
import { SOUND_OPTIONS, previewSound, type SoundType } from '@/lib/sounds'

const PRESETS = [
  { label: 'Classic', focus: 25, shortBreak: 5, longBreak: 15 },
  { label: 'Extended', focus: 50, shortBreak: 10, longBreak: 30 },
  { label: 'Short Sprint', focus: 15, shortBreak: 3, longBreak: 10 },
]

export function TimerSettings() {
  const { settings, updateSettings } = useStore()
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
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
  )
}
