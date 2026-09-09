import { describe, expect, it } from 'vitest'

import {
  getUserRights,
  hasRequiredRights,
  RIGHTS,
  type Right,
} from '@/lib/permissions'

function makeUser(
  roles?: Array<{ name: string; rights?: Array<{ authority: string }> }>,
): { roles?: Array<{ name: string; rights?: Array<{ authority: string }> }> } {
  return { roles }
}

describe('hasRequiredRights', () => {
  const rights = ['USER_READ', 'USER_CREATE']

  it('allows access when required is undefined', () => {
    expect(hasRequiredRights(rights, undefined)).toBe(true)
  })

  it('allows access when required is an empty array', () => {
    expect(hasRequiredRights(rights, [])).toBe(true)
  })

  it('returns true for a single held right', () => {
    expect(hasRequiredRights(rights, RIGHTS.USER_READ)).toBe(true)
  })

  it('returns false for a single missing right', () => {
    expect(hasRequiredRights(rights, RIGHTS.ROLE_CREATE)).toBe(false)
  })

  it('returns true when at least one of multiple required rights is held (OR semantics)', () => {
    const required: Right[] = [RIGHTS.ROLE_CREATE, RIGHTS.USER_READ]
    expect(hasRequiredRights(rights, required)).toBe(true)
  })

  it('returns false when none of the required rights are held', () => {
    const required: Right[] = [RIGHTS.ROLE_CREATE, RIGHTS.USER_DELETE]
    expect(hasRequiredRights(rights, required)).toBe(false)
  })

  it('does not mutate the passed arrays', () => {
    const userRights = ['USER_READ']
    const required: Right[] = [RIGHTS.USER_READ]
    const userRightsCopy = [...userRights]
    const requiredCopy = [...required]

    hasRequiredRights(userRights, required)

    expect(userRights).toEqual(userRightsCopy)
    expect(required).toEqual(requiredCopy)
  })
})

describe('getUserRights', () => {
  it('returns an empty array for undefined user', () => {
    expect(getUserRights(undefined)).toEqual([])
  })

  it('returns an empty array when user has no roles', () => {
    expect(getUserRights(makeUser())).toEqual([])
  })

  it('returns an empty array when user has roles with no rights', () => {
    const user = makeUser([{ name: 'ADMIN' }])
    expect(getUserRights(user)).toEqual([])
  })

  it('flattens rights from all roles', () => {
    const user = makeUser([
      {
        name: 'ADMIN',
        rights: [{ authority: 'USER_CREATE' }, { authority: 'USER_READ' }],
      },
      { name: 'USER', rights: [{ authority: 'USER_READ' }] },
    ])
    expect(getUserRights(user)).toEqual(['USER_CREATE', 'USER_READ'])
  })

  it('deduplicates rights that appear in multiple roles', () => {
    const user = makeUser([
      { name: 'ADMIN', rights: [{ authority: 'USER_READ' }] },
      { name: 'USER', rights: [{ authority: 'USER_READ' }] },
    ])
    expect(getUserRights(user)).toEqual(['USER_READ'])
  })
})
