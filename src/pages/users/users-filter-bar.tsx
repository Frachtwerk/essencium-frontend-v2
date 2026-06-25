import { getRouteApi } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { useAllRoles } from '@/hooks/data/roles'

const route = getRouteApi('/_authenticated/users/')

const DEBOUNCE_MS = 350

export function UsersFilterBar(): React.ReactElement {
  const { t } = useTranslation()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: rolesPage } = useAllRoles()
  const roleNames = (rolesPage.content ?? []).map(role => role.name)
  const rolesAnchorRef = useComboboxAnchor()

  const [name, setName] = useState(search.name ?? '')
  const [email, setEmail] = useState(search.email ?? '')
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const emailTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  const selectedRoles = search.roles ?? []

  function onNameChange(value: string): void {
    setName(value)
    clearTimeout(nameTimerRef.current)
    nameTimerRef.current = setTimeout(() => {
      void navigate({
        search: prev => ({ ...prev, name: value.trim() || undefined, page: 0 }),
      })
    }, DEBOUNCE_MS)
  }

  function onEmailChange(value: string): void {
    setEmail(value)
    clearTimeout(emailTimerRef.current)
    emailTimerRef.current = setTimeout(() => {
      void navigate({
        search: prev => ({
          ...prev,
          email: value.trim() || undefined,
          page: 0,
        }),
      })
    }, DEBOUNCE_MS)
  }

  function onRolesChange(values: string[]): void {
    void navigate({
      search: prev => ({
        ...prev,
        roles: values.length ? values : undefined,
        page: 0,
      }),
    })
  }

  return (
    <div className="flex flex-wrap items-start gap-2">
      <Input
        placeholder={t('users.filter.name')}
        value={name}
        onChange={e => onNameChange(e.target.value)}
        className="max-w-48"
        aria-label={t('users.filter.name')}
      />
      <Input
        placeholder={t('users.filter.email')}
        value={email}
        onChange={e => onEmailChange(e.target.value)}
        className="max-w-56"
        aria-label={t('users.filter.email')}
      />
      <Combobox
        items={roleNames}
        multiple
        value={selectedRoles}
        onValueChange={onRolesChange}
      >
        <ComboboxChips ref={rolesAnchorRef} className="w-64">
          <ComboboxValue>
            {(values: string[]) =>
              values.map(value => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput
            placeholder={t('users.filter.roles')}
            aria-label={t('users.filter.roles')}
          />
        </ComboboxChips>
        <ComboboxContent anchor={rolesAnchorRef}>
          <ComboboxEmpty>{t('users.filter.noRoles')}</ComboboxEmpty>
          <ComboboxList>
            {(role: string) => (
              <ComboboxItem key={role} value={role}>
                {role}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
