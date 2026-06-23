import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, Resolver } from 'react-hook-form'
import type { ZodType } from 'zod'

/**
 * Thin wrapper around `zodResolver` that isolates a types-only incompatibility
 * between zod 4.4 and @hookform/resolvers 5.2 (the resolver's overloads still
 * carry the zod-4.0 version brand). Runtime behaviour is unaffected; this keeps
 * the cast in one place so form call sites stay clean and type-safe.
 */
export function zodFormResolver<T extends FieldValues>(
  schema: ZodType<T>,
): Resolver<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see doc comment above
  return zodResolver(schema as any) as Resolver<T>
}
