interface TimerBarProps {
  timeLeft: number
  total?: number
}

export default function TimerBar({ timeLeft, total = 15 }: TimerBarProps) {
  const pct = (timeLeft / total) * 100
  const color =
    timeLeft > 8
      ? 'bg-primary'
      : timeLeft > 4
        ? 'bg-yellow-400'
        : 'bg-red-500'

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
        <span>Tiempo</span>
        <span className={timeLeft <= 4 ? 'text-red-500 font-bold' : ''}>
          {timeLeft}s
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
