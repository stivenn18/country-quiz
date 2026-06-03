import { useDarkMode } from '../hooks/useDarkMode'

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode()

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200
        hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-lg"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
