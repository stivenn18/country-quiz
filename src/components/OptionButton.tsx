interface OptionButtonProps {
  label: string
  state: 'default' | 'correct' | 'wrong' | 'disabled'
  onClick: () => void
}

const stateStyles: Record<OptionButtonProps['state'], string> = {
  default:
    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary hover:text-primary dark:hover:border-primary cursor-pointer',
  correct:
    'border-correct bg-correct/10 text-correct font-semibold cursor-default',
  wrong: 'border-wrong bg-wrong/10 text-wrong font-semibold cursor-default',
  disabled:
    'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-default',
}

export default function OptionButton({
  label,
  state,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      onClick={state === 'default' ? onClick : undefined}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm md:text-base
        text-gray-700 dark:text-gray-200 ${stateStyles[state]}`}
      aria-label={`Opción: ${label}`}
    >
      {state === 'correct' && <span className="mr-2">✅</span>}
      {state === 'wrong' && <span className="mr-2">❌</span>}
      {label}
    </button>
  )
}
