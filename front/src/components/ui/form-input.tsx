import * as React from 'react'
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface FormInputClassNames {
  container?: string
  label?: string
  input?: string
  description?: string
  message?: string
}

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  placeholder?: string
  description?: string
  type?: React.HTMLInputTypeAttribute
  disabled?: boolean
  classNames?: FormInputClassNames
  /** Optional extra content to render in the label row (e.g., "Forgot password?" link or help tooltip) */
  labelExtra?: React.ReactNode
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  disabled,
  classNames,
  labelExtra,
}: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(classNames?.container)}>
          {(label || labelExtra) && (
            <div
              className={cn(
                'flex items-center',
                labelExtra && 'justify-between'
              )}
            >
              {label && (
                <FormLabel className={classNames?.label}>{label}</FormLabel>
              )}
              {labelExtra}
            </div>
          )}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={classNames?.input}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          {description && (
            <FormDescription className={classNames?.description}>
              {description}
            </FormDescription>
          )}
          <FormMessage className={classNames?.message} />
        </FormItem>
      )}
    />
  )
}
