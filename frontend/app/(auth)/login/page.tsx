'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'University email is required')
    .email('Enter a valid email address')
    .refine((val) => val.toLowerCase().endsWith('@seu.edu.bd'), {
      message: 'Only @seu.edu.bd student/faculty emails are allowed',
    }),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email') || '';
  const isSeuEmail = emailValue.toLowerCase().endsWith('@seu.edu.bd');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await authService.login(data);
      toast.success('Access granted // Welcome back');
      router.push('/events');
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Invalid credentials. Please verify your @seu.edu.bd email and password.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
          SECURITY CLEARANCE // LEVEL 01
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
          SIGN IN TO SEU EVENTS
        </h1>
        <p className="text-xs text-[#8A8A93] leading-relaxed">
          Access upcoming campus competitions, squads, and your verified digital tickets.
        </p>
      </div>

      {/* Obsidian Card */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email Field with Live Domain Verification */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-email" className="text-xs font-mono uppercase text-[#8A8A93]">
                University Email
              </label>
              {isSeuEmail ? (
                <span className="text-[10px] font-mono text-[#C8FF00] flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  VERIFIED @SEU.EDU.BD
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#8A8A93]">
                  REQUIRED: @seu.edu.bd
                </span>
              )}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="login-email"
                type="email"
                placeholder="2024000000309@seu.edu.bd"
                autoComplete="email"
                autoFocus
                {...register('email')}
                className={`w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-[#FF2E4C] focus:border-[#FF2E4C]'
                    : isSeuEmail
                    ? 'border-[#C8FF00]/40 focus:border-[#C8FF00]'
                    : 'border-white/10 focus:border-[#FF4D00]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-mono text-[#FF2E4C] mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-mono uppercase text-[#8A8A93]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full h-10 pl-9 pr-10 text-xs font-mono bg-[#18181E] border rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none transition-colors ${
                  errors.password
                    ? 'border-[#FF2E4C] focus:border-[#FF2E4C]'
                    : 'border-white/10 focus:border-[#FF4D00]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A93] hover:text-[#F4F4F0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-mono text-[#FF2E4C] mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)] mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                AUTHORIZE SIGN IN
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Switch to Register */}
      <div className="text-center">
        <p className="text-xs font-mono text-[#8A8A93]">
          FIRST TIME COMPETING?{' '}
          <Link
            href="/register"
            className="text-[#FF4D00] font-bold hover:underline underline-offset-4 ml-1"
          >
            CREATE @SEU.EDU.BD ACCOUNT →
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
