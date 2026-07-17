import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  use,
  useId,
  type ComponentProps,
  type ReactElement,
} from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const Form = FormProvider

interface FormFieldContextValue {
  name: string
}
const FormFieldContext = createContext<FormFieldContextValue | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>): React.ReactElement {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  )
}

interface FormItemContextValue {
  id: string
}
const FormItemContext = createContext<FormItemContextValue | null>(null)

interface UseFormFieldResult {
  id: string
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error?: string
}

function useFormField(): UseFormFieldResult {
  const fieldContext = use(FormFieldContext)
  const itemContext = use(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })

  if (!fieldContext) {
    throw new Error('useFormField must be used within <FormField>')
  }
  if (!itemContext) {
    throw new Error('useFormField must be used within <FormItem>')
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error:
      typeof fieldState.error?.message === 'string'
        ? fieldState.error.message
        : undefined,
  }
}

function FormItem({
  className,
  ...props
}: ComponentProps<'div'>): React.ReactElement {
  const id = useId()
  return (
    <FormItemContext value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext>
  )
}

function FormLabel({
  className,
  ...props
}: ComponentProps<typeof Label>): React.ReactElement {
  const { error, formItemId } = useFormField()
  return (
    <Label
      htmlFor={formItemId}
      className={cn(error && 'text-destructive-400', className)}
      {...props}
    />
  )
}

/** Injects id + aria wiring onto the single form control child (no Radix Slot). */
function FormControl({
  children,
}: {
  children: ReactElement
}): React.ReactElement {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const child = Children.only(children)
  if (!isValidElement(child)) return child
  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    id: formItemId,
    'aria-describedby': error
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId,
    'aria-invalid': !!error,
  })
}

function FormDescription({
  className,
  ...props
}: ComponentProps<'p'>): React.ReactElement {
  const { formDescriptionId } = useFormField()
  return (
    <p
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: ComponentProps<'p'>): React.ReactElement | null {
  const { t } = useTranslation()
  const { error, formMessageId } = useFormField()
  // Validation messages are i18n keys. i18next returns the input unchanged for
  // unknown keys, so this is a safe pass-through for non-key strings too.
  const body = error ? t(error as ParseKeys) : children
  if (!body) return null
  return (
    <p
      id={formMessageId}
      className={cn('text-destructive-400 text-sm font-medium', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
