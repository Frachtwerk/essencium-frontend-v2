import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

interface DebouncedSearchInputProps {
  value: string
  onDebouncedChange: (value: string) => void
  placeholder?: string
  delayMs?: number
  className?: string
}

export function DebouncedSearchInput({
  value,
  onDebouncedChange,
  placeholder,
  delayMs = 350,
  className,
}: DebouncedSearchInputProps): React.ReactElement {
  const [input, setInput] = useState(value)
  const debounced = useDebounce(input, delayMs)

  const lastReportedRef = useRef(value)

  useEffect(() => {
    const trimmed = debounced.trim()
    if (trimmed === lastReportedRef.current) return

    lastReportedRef.current = trimmed
    onDebouncedChange(trimmed)
  }, [debounced, onDebouncedChange])

  return (
    <Input
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={className}
    />
  )
}
