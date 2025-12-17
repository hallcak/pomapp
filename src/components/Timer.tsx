import { useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { formatTime, sendNotification } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { playSound, type SoundType } from '@/lib/sounds'

export function Timer() {
  const {
    timerState,
    currentSession,
    timeRemaining,
    completedPomodoros,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    completeSession,
    getSessionDuration,
  } = useStore()

  const totalDuration = getSessionDuration(currentSession)
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100

  const getProgressColor = () => {
    switch (currentSession) {
      case 'focus':
        return '#ff6905'
      case 'short-break':
        return '#a805ff'
      case 'long-break':
        return '#22c55e'
    }
  }

  const handleComplete = useCallback(() => {
    playSound(settings.endSound as SoundType)

    const nextSession =
      currentSession === 'focus'
        ? (completedPomodoros + 1) % settings.pomodorosUntilLongBreak === 0
          ? 'Long Break'
          : 'Short Break'
        : 'Focus'

    sendNotification(
      currentSession === 'focus' ? 'Pomodoro Complete!' : 'Break Over!',
      `Time for ${nextSession.toLowerCase()}!`
    )

    completeSession()
  }, [currentSession, completedPomodoros, settings.pomodorosUntilLongBreak, settings.endSound, completeSession])

  useEffect(() => {
    let interval: number | undefined

    if (timerState === 'running') {
      interval = window.setInterval(() => {
        const currentTime = useStore.getState().timeRemaining
        if (currentTime <= 1) {
          handleComplete()
        } else {
          tick()
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerState, tick, handleComplete])

  const handleStart = () => {
    if (timerState === 'idle') {
      playSound(settings.startSound as SoundType)
    }
    startTimer()
  }

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'focus':
        return 'Focus Time'
      case 'short-break':
        return 'Short Break'
      case 'long-break':
        return 'Long Break'
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Session Label */}
      <h2 className="mb-8 text-2xl font-black uppercase tracking-tight text-foreground">
        {getSessionLabel()}
      </h2>

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Progress Ring */}
        <svg className="w-80 h-80 -rotate-90">
          {/* Background ring */}
          <circle
            cx="160"
            cy="160"
            r="148"
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="8"
          />
          {/* Active progress ring */}
          <circle
            cx="160"
            cy="160"
            r="148"
            fill="none"
            stroke={getProgressColor()}
            strokeWidth="8"
            strokeLinecap="square"
            strokeDasharray={2 * Math.PI * 148}
            strokeDashoffset={2 * Math.PI * 148 * (1 - progress / 100)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Timer Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'w-64 h-64 rounded-full border-4 border-foreground flex items-center justify-center shadow-[4px_4px_0_0_#0a0a0a] bg-background',
              timerState === 'running' && 'animate-pulse-border'
            )}
          >
            <span className="font-mono text-6xl font-black tracking-tighter">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button variant="outline" size="icon" onClick={resetTimer}>
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          onClick={timerState === 'running' ? pauseTimer : handleStart}
          className="w-40"
        >
          {timerState === 'running' ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              {timerState === 'paused' ? 'Resume' : 'Start'}
            </>
          )}
        </Button>

        <Button variant="outline" size="icon" onClick={completeSession}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Pomodoro Counter */}
      <div className="mt-8 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground uppercase">
          Pomodoros:
        </span>
        <div className="flex gap-1">
          {Array.from({ length: settings.pomodorosUntilLongBreak }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-4 border-2 border-foreground',
                i < (completedPomodoros % settings.pomodorosUntilLongBreak)
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
        <span className="font-mono font-bold ml-2">{completedPomodoros}</span>
      </div>
    </div>
  )
}
