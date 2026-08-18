import {
  RiDashboardLine,
  RiGroupLine,
  RiKeyLine,
  RiShieldCheckLine,
  RiShieldKeyholeLine,
  type RemixiconComponentType,
} from '@remixicon/react'
import type { LinkProps } from '@tanstack/react-router'
import type { ParseKeys } from 'i18next'

import { RIGHTS, type Right, type RightsMode } from '@/lib/permissions'

export interface NavItem {
  /** i18n key for the label, e.g. `navigation.users`. */
  labelKey: ParseKeys
  to: LinkProps['to']
  icon: RemixiconComponentType
  /** Right(s) required to see this item. Omit = always visible. */
  rights?: Right | readonly Right[]
  /**
   * How multiple `rights` combine: `any` (default, OR) or `all` (AND). Passed
   * straight to `hasRequiredRights`, which owns the semantics.
   */
  mode?: RightsMode
}

/** Primary sidebar navigation. Order is the display order. */
export const NAV_ITEMS: readonly NavItem[] = [
  {
    labelKey: 'navigation.dashboard',
    to: '/',
    icon: RiDashboardLine,
  },
  {
    labelKey: 'navigation.users',
    to: '/users',
    icon: RiGroupLine,
    rights: RIGHTS.USER_READ,
  },
  {
    labelKey: 'navigation.roles',
    to: '/roles',
    icon: RiShieldCheckLine,
    rights: [RIGHTS.ROLE_READ, RIGHTS.RIGHT_READ],
    mode: 'all',
  },
  {
    labelKey: 'navigation.rights',
    to: '/rights',
    icon: RiShieldKeyholeLine,
    rights: [RIGHTS.ROLE_UPDATE, RIGHTS.RIGHT_READ],
    mode: 'all',
  },
  {
    labelKey: 'navigation.apiTokens',
    to: '/api-tokens',
    icon: RiKeyLine,
    rights: [RIGHTS.API_TOKEN, RIGHTS.API_TOKEN_ADMIN],
  },
]
