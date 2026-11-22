'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  X,
  Sparkles,
  Calendar,
  Layers,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateEvent } from '@/features/events/hooks/useCreateEvent';
import { CATEGORY_OPTIONS, EVENT_TYPE_OPTIONS } from '@/features/events/utils';

const createEventSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title is too long'),
    category: z.enum(
      ['hackathon', 'workshop', 'seminar', 'competition', 'cultural', 'sports', 'other'],
      { error: 'Please select a category' }
    ),
    eventType: z.enum(['online', 'offline', 'hybrid'], {
      error: 'Please select an event type',
    }),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters'),
    registrationDeadline: z
      .string()
      .min(1, 'Registration deadline is required'),
    eventDate: z.string().min(1, 'Event date is required'),
    registrationLink: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.startsWith('http'),
        'Enter a valid URL (must start with http:// or https://)'
      ),
  })
  .refine(
    (data) => {
      if (!data.registrationDeadline || !data.eventDate) return true;
      return new Date(data.eventDate) > new Date(data.registrationDeadline);
    },
    {
      message: 'Event date must be after the registration deadline',
      path: ['eventDate'],
    }
  );

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateEvent();

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
      const event = await mutateAsync({
        ...data,
        bannerImage: bannerFile ?? undefined,
        registrationLink: data.registrationLink || undefined,
      });
      toast.success('Dispatch broadcasted successfully!');
      router.push(`/events/${event.id}`);
    } catch {
      // error toast already handled
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back Link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#FF4D00] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        BACK TO CAMPUS DISPATCH
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
          NEW TRANSMISSION // BROADCAST DISPATCH
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
          HOST CAMPUS EVENT
        </h1>
        <p className="text-xs text-[#8A8A93]">
          Publish a new hackathon, competition, workshop or seminar for Southeast University.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl bg-[#111114] border border-white/10 p-6 space-y-4 shadow-lg">
          <div className="text-xs font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
            DISPATCH SPECIFICATIONS
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="ev-title" className="text-xs font-mono uppercase text-[#8A8A93]">
              Event Title
            </label>
            <input
              id="ev-title"
              placeholder="e.g. SEU AI Hackathon 2026 // Spring Edition"
              autoFocus
              {...register('title')}
              className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00] transition-colors"
            />
            {errors.title && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.title.message}</p>
            )}
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ev-category" className="text-xs font-mono uppercase text-[#8A8A93]">
                Category
              </label>
              <Select
                onValueChange={(val) =>
                  setValue('category', val as CreateEventFormValues['category'], {
                    shouldValidate: true,
                  })
                }
                value={watch('category')}
              >
                <SelectTrigger id="ev-category" className="h-10 text-xs font-mono bg-[#18181E] border-white/10 text-[#F4F4F0]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#141418] border-white/15 text-[#F4F4F0]">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs font-mono">
                      {opt.label.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ev-type" className="text-xs font-mono uppercase text-[#8A8A93]">
                Mode / Venue
              </label>
              <Select
                onValueChange={(val) =>
                  setValue('eventType', val as CreateEventFormValues['eventType'], {
                    shouldValidate: true,
                  })
                }
                value={watch('eventType')}
              >
                <SelectTrigger id="ev-type" className="h-10 text-xs font-mono bg-[#18181E] border-white/10 text-[#F4F4F0]">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent className="bg-[#141418] border-white/15 text-[#F4F4F0]">
                  {EVENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs font-mono">
                      {opt.label.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventType && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.eventType.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="ev-description" className="text-xs font-mono uppercase text-[#8A8A93]">
              Description &amp; Guidelines
            </label>
            <textarea
              id="ev-description"
              rows={5}
              placeholder="Detail eligibility, event rules, prizes, roadmap, and requirements..."
              {...register('description')}
              className="w-full p-3 text-xs font-sans bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00] transition-colors"
            />
            {errors.description && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="rounded-xl bg-[#111114] border border-white/10 p-6 space-y-4 shadow-lg">
          <div className="text-xs font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#C8FF00]" />
            TIMELINE &amp; DEADLINES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ev-deadline" className="text-xs font-mono uppercase text-[#8A8A93]">
                Registration Closes
              </label>
              <input
                id="ev-deadline"
                type="date"
                {...register('registrationDeadline')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] focus:outline-none focus:border-[#FF4D00]"
              />
              {errors.registrationDeadline && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.registrationDeadline.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ev-date" className="text-xs font-mono uppercase text-[#8A8A93]">
                Event Day
              </label>
              <input
                id="ev-date"
                type="date"
                {...register('eventDate')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] focus:outline-none focus:border-[#FF4D00]"
              />
              {errors.eventDate && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.eventDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Registration Link & Banner */}
        <div className="rounded-xl bg-[#111114] border border-white/10 p-6 space-y-4 shadow-lg">
          <div className="text-xs font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-3.5 h-3.5 text-[#FF4D00]" />
            MEDIA &amp; EXTERNAL FORMS
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ev-link" className="text-xs font-mono uppercase text-[#8A8A93]">
              Official Form URL (Optional)
            </label>
            <input
              id="ev-link"
              type="url"
              placeholder="https://forms.google.com/..."
              {...register('registrationLink')}
              className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
            />
            {errors.registrationLink && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.registrationLink.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#8A8A93]">
              Cover Banner (Optional — Procedural Art Generated if Empty)
            </label>
            {bannerPreview ? (
              <div className="relative h-44 rounded-lg overflow-hidden border border-white/15">
                <Image src={bannerPreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-[#09090B]/80 text-[#FF2E4C] border border-[#FF2E4C]/40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-white/10 hover:border-[#FF4D00]/50 bg-[#18181E]/50 flex flex-col items-center justify-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#F4F4F0] transition-colors"
              >
                <ImagePlus className="w-6 h-6 text-[#FF4D00]" />
                <span>UPLOAD CUSTOM BANNER IMAGE</span>
                <span className="text-[10px] text-[#8A8A93]/60">PNG, JPG UP TO 5MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="outline" className="font-mono text-xs uppercase border-white/10 bg-[#18181E] text-[#F4F4F0]">
            <Link href="/events">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 px-6 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'BROADCAST DISPATCH'}
          </Button>
        </div>
      </form>
    </div>
  );
}
