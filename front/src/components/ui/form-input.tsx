import * as React from 'react'
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  const [showPassword, setShowPassword] = React.useState(false)
  const isPasswordType = type === 'password'

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
            <div className="relative">
              <Input
                type={isPasswordType && showPassword ? 'text' : type}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(isPasswordType && 'pr-10', classNames?.input)}
                {...field}
                value={field.value ?? ''}
              />
              {isPasswordType && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  </span>
                </Button>
              )}
            </div>
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
