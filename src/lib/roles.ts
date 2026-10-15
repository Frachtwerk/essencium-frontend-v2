import type { Role } from '@/generated/client/types.gen'

/**
 * Whether a role is locked against edits. The backend rejects any update to
 * config-defined roles (`systemRole`) and to `protected` roles, so the UI hides
 * edit actions for them instead of letting the save fail.
 */
export function isRoleLocked(role: Role): boolean {
  return role.systemRole === true || role.protected === true
}
