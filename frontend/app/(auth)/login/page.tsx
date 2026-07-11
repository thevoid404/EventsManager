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
import { authService } from '@/services/auth.service';


// ─── Schema ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .refine((val) => val.endsWith('@seu.edu.bd'), {
      message: 'Only @seu.edu.bd email addresses are allowed',
    }),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      toast.success('Welcome back!');
      router.push('/events');
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Invalid email or password. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[340px]">
      {/* Card */}
      <div className="border border-border rounded-lg bg-card px-6 py-7 space-y-5">
        <div className="space-y-1">
          <h1 className="text-base font-semibold">Sign in to SEU Events</h1>
          <p className="text-xs text-muted-foreground">
            Use your <span className="font-medium text-foreground">@seu.edu.bd</span> email address
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-sm">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@seu.edu.bd"
              autoComplete="email"
              autoFocus
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-sm">
              Password
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            id="login-submit"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        New to SEU Events?{' '}
        <Link
          href="/register"
          className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
