'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authService } from '@/services/auth.service';

// ─── Departments ───────────────────────────────────────────────────────────

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical & Electronic Engineering',
  'Business Administration (BBA)',
  'Business Administration (MBA)',
  'English',
  'Law',
  'Pharmacy',
  'Civil Engineering',
  'Architecture',
  'Textile Engineering',
  'Other',
] as const;

// ─── Schema ────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address')
      .refine((val) => val.endsWith('@seu.edu.bd'), {
        message: 'Only @seu.edu.bd email addresses are allowed',
      }),
    department: z.string().min(1, 'Please select your department'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Page ──────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        department: data.department,
        password: data.password,
      });
      toast.success('Account created! Welcome to SEU Events.');
      router.push('/events');
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px]">
      {/* Card */}
      <div className="border border-border rounded-lg bg-card px-6 py-7 space-y-5">
        <div className="space-y-1">
          <h1 className="text-base font-semibold">Create your account</h1>
          <p className="text-xs text-muted-foreground">
            Use your{' '}
            <span className="font-medium text-foreground">@seu.edu.bd</span>{' '}
            university email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-name" className="text-sm">
              Full Name
            </Label>
            <Input
              id="reg-name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              autoFocus
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-email" className="text-sm">
              University Email
            </Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="you@seu.edu.bd"
              autoComplete="email"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-department" className="text-sm">
              Department
            </Label>
            <Select
              onValueChange={(val) =>
                setValue('department', val as string, { shouldValidate: true })
              }
              value={watch('department')}
            >
              <SelectTrigger id="reg-department" aria-invalid={!!errors.department}>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-xs text-destructive" role="alert">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-password" className="text-sm">
              Password
            </Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm-password" className="text-sm">
              Confirm Password
            </Label>
            <Input
              id="reg-confirm-password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            id="register-submit"
            type="submit"
            className="w-full mt-1"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Create account
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
