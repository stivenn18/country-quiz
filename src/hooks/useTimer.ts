import { useState, useEffect, useRef, useCallback } from 'react'

const TIMER_SECONDS = 15

export function useTimer(
  active: boolean,
  onExpire: () => void,
) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const reset = useCallback(() => setTimeLeft(TIMER_SECONDS), [])

  useEffect(() => {
    if (!active) return
    if (timeLeft === 0) {
      onExpireRef.current()
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [active, timeLeft])

  return { timeLeft, reset }
}
