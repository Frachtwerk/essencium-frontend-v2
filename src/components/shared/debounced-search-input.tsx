import { RiCloseLargeLine } from '@remixicon/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

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
  const { t } = useTranslation()
  const [input, setInput] = useState(value)
  const debounced = useDebounce(input, delayMs)

  const lastReportedRef = useRef(value)

  useEffect(() => {
    const trimmed = debounced.trim()
    if (trimmed === lastReportedRef.current) return

    lastReportedRef.current = trimmed
    onDebouncedChange(trimmed)
  }, [debounced, onDebouncedChange])

  function clear(): void {
    setInput('')
    lastReportedRef.current = ''
    onDebouncedChange('')
  }

  return (
    <ButtonGroup className={cn('w-full', className)}>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />

      <Button
        type="button"
        disabled={!input}
        variant="outline"
        size="icon-sm"
        aria-label={t('common.clearSearch')}
        onClick={clear}
      >
        <RiCloseLargeLine />
      </Button>
    </ButtonGroup>
  )
}
