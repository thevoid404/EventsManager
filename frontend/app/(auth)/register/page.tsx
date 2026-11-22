'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authService } from '@/services/auth.service';
import { motion } from 'framer-motion';

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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'University email is required')
      .email('Enter a valid email address')
      .refine((val) => val.toLowerCase().endsWith('@seu.edu.bd'), {
        message: 'Only @seu.edu.bd student/faculty emails are allowed',
      }),
    department: z.string().min(1, 'Please select your department'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const emailValue = watch('email') || '';
  const isSeuEmail = emailValue.toLowerCase().endsWith('@seu.edu.bd');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        department: data.department,
        password: data.password,
      });
      toast.success('Registration complete // Welcome to SEU Events');
      router.push('/events');
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Registration failed. An account with this email may already exist.';
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
        <div className="text-[10px] font-mono tracking-widest text-[#C8FF00] uppercase font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
          NEW COMPETITOR REGISTRATION // 2026
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
          CREATE SEU ACCOUNT
        </h1>
        <p className="text-xs text-[#8A8A93] leading-relaxed">
          Unlock your digital event ticket, register squads, and connect with fellow Southeast University developers.
        </p>
      </div>

      {/* Obsidian Card */}
      <div className="rounded-xl border border-white/10 bg-[#111114] p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-xs font-mono uppercase text-[#8A8A93]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                placeholder="Ashraf Uddin Anas"
                autoComplete="name"
                autoFocus
                {...register('name')}
                className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="reg-email" className="text-xs font-mono uppercase text-[#8A8A93]">
                University Email
              </label>
              {isSeuEmail ? (
                <span className="text-[10px] font-mono text-[#C8FF00] flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  SEU DOMAIN OK
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#8A8A93]">@seu.edu.bd</span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                placeholder="student.id@seu.edu.bd"
                autoComplete="email"
                {...register('email')}
                className={`w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none transition-colors ${
                  isSeuEmail ? 'border-[#C8FF00]/40' : 'border-white/10 focus:border-[#FF4D00]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.email.message}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label htmlFor="reg-department" className="text-xs font-mono uppercase text-[#8A8A93]">
              Department
            </label>
            <Select
              onValueChange={(val) =>
                setValue('department', val as string, { shouldValidate: true })
              }
              value={watch('department')}
            >
              <SelectTrigger
                id="reg-department"
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 text-[#F4F4F0] focus:ring-1 focus:ring-[#FF4D00]"
              >
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="bg-[#141418] border border-white/15 text-[#F4F4F0]">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept} className="font-mono text-xs">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.department.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-xs font-mono uppercase text-[#8A8A93]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                {...register('password')}
                className="w-full h-10 pl-9 pr-10 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A93] hover:text-[#F4F4F0]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-mono uppercase text-[#8A8A93]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A93] pointer-events-none" />
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.confirmPassword.message}</p>
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
                REGISTER COMPETITOR ACCOUNT
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Switch to Login */}
      <div className="text-center">
        <p className="text-xs font-mono text-[#8A8A93]">
          ALREADY ENROLLED?{' '}
          <Link
            href="/login"
            className="text-[#FF4D00] font-bold hover:underline underline-offset-4 ml-1"
          >
            SIGN IN TO ACCOUNT →
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
