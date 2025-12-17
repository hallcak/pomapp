import { useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Timer } from '@/components/Timer'
import { TimerSettings } from '@/components/TimerSettings'
import { TaskList } from '@/components/TaskList'
import { Button } from '@/components/ui/button'
import { requestNotificationPermission } from '@/lib/utils'
import { useState } from 'react'

export function Home() {
  const [notificationEnabled, setNotificationEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  )

  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission()
    setNotificationEnabled(permission === 'granted')
  }

  useEffect(() => {
    // Update document title with timer
    const unsubscribe = () => {}
    return unsubscribe
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Timer</h1>
          <p className="text-muted-foreground mt-1">
            Focus on what matters. One pomodoro at a time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnableNotifications}
            disabled={notificationEnabled}
          >
            {notificationEnabled ? (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Notifications On
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Enable Notifications
              </>
            )}
          </Button>
          <TimerSettings />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Section */}
        <div className="lg:col-span-2 flex justify-center">
          <Timer />
        </div>

        {/* Task Panel */}
        <div className="lg:col-span-1">
          <TaskList compact />
        </div>
      </div>
    </div>
  )
}
