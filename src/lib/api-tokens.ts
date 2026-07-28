import type { Badge } from '@/components/ui/badge'

export const TOKEN_STATUS = {
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED',
  REVOKED_ROLE_CHANGED: 'REVOKED_ROLE_CHANGED',
  REVOKED_RIGHTS_CHANGED: 'REVOKED_RIGHTS_CHANGED',
  REVOKED_USER_CHANGED: 'REVOKED_USER_CHANGED',
  EXPIRED: 'EXPIRED',
  USER_DELETED: 'USER_DELETED',
} as const

export type TokenStatus = (typeof TOKEN_STATUS)[keyof typeof TOKEN_STATUS]

type BadgeVariant = React.ComponentProps<typeof Badge>['variant']

export const TOKEN_STATUS_BADGE_VARIANT: Record<TokenStatus, BadgeVariant> = {
  [TOKEN_STATUS.ACTIVE]: 'default',
  [TOKEN_STATUS.REVOKED]: 'outline',
  [TOKEN_STATUS.REVOKED_ROLE_CHANGED]: 'outline',
  [TOKEN_STATUS.REVOKED_RIGHTS_CHANGED]: 'outline',
  [TOKEN_STATUS.REVOKED_USER_CHANGED]: 'outline',
  [TOKEN_STATUS.EXPIRED]: 'outline',
  [TOKEN_STATUS.USER_DELETED]: 'outline',
}
