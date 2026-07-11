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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCreateEvent } from '@/features/events/hooks/useCreateEvent';
import { CATEGORY_OPTIONS, EVENT_TYPE_OPTIONS } from '@/features/events/utils';

// ─── Schema ────────────────────────────────────────────────────────────────

const createEventSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title is too long'),
    category: z.enum(
      ['hackathon', 'workshop', 'seminar', 'competition', 'cultural', 'sports', 'other'],
      { error: 'Please select a category' },
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
        'Enter a valid URL (must start with http:// or https://)',
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
    },
  );

type CreateEventFormValues = z.infer<typeof createEventSchema>;

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CreateEventPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateEvent();

  // Banner image state (handled outside RHF)
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
      toast.success('Event created successfully!');
      router.push(`/events/${event.id}`);
    } catch {
      // error toast already shown by hook
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Events
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Create Event</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fill in the details to post a new university event.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* ── Basic Info ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Basic Info
          </h2>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-title">Event Title</Label>
            <Input
              id="ev-title"
              placeholder="e.g. SEU Hackathon 2025"
              autoFocus
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Category + Event Type (2-col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-category">Category</Label>
              <Select
                onValueChange={(val) =>
                  setValue('category', val as CreateEventFormValues['category'], {
                    shouldValidate: true,
                  })
                }
                value={watch('category')}
              >
                <SelectTrigger
                  id="ev-category"
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-type">Event Type</Label>
              <Select
                onValueChange={(val) =>
                  setValue('eventType', val as CreateEventFormValues['eventType'], {
                    shouldValidate: true,
                  })
                }
                value={watch('eventType')}
              >
                <SelectTrigger id="ev-type" aria-invalid={!!errors.eventType}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventType && (
                <p className="text-xs text-destructive">
                  {errors.eventType.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-description">Description</Label>
            <Textarea
              id="ev-description"
              placeholder="Describe the event, what participants can expect, requirements, prizes, etc."
              rows={5}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        <Separator />

        {/* ── Dates ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Dates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-deadline">Registration Deadline</Label>
              <Input
                id="ev-deadline"
                type="date"
                {...register('registrationDeadline')}
                aria-invalid={!!errors.registrationDeadline}
              />
              {errors.registrationDeadline && (
                <p className="text-xs text-destructive">
                  {errors.registrationDeadline.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-date">Event Date</Label>
              <Input
                id="ev-date"
                type="date"
                {...register('eventDate')}
                aria-invalid={!!errors.eventDate}
              />
              {errors.eventDate && (
                <p className="text-xs text-destructive">
                  {errors.eventDate.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Links & Media ── */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Links &amp; Media
          </h2>

          {/* Registration link */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-link">
              Registration Link{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="ev-link"
              type="url"
              placeholder="https://forms.google.com/..."
              {...register('registrationLink')}
              aria-invalid={!!errors.registrationLink}
            />
            {errors.registrationLink && (
              <p className="text-xs text-destructive">
                {errors.registrationLink.message}
              </p>
            )}
          </div>

          {/* Banner image */}
          <div className="space-y-1.5">
            <Label>
              Banner Image{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>

            {bannerPreview ? (
              <div className="relative h-44 rounded-lg overflow-hidden border border-border">
                <Image
                  src={bannerPreview}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 shadow"
                  onClick={removeBanner}
                  aria-label="Remove banner"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-foreground/40 transition-colors text-muted-foreground hover:text-foreground"
              >
                <ImagePlus className="h-6 w-6 mb-1.5" />
                <span className="text-xs">Click to upload banner image</span>
                <span className="text-xs opacity-60 mt-0.5">PNG, JPG up to 5MB</span>
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
        </section>

        <Separator />

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end pb-4">
          <Button asChild variant="ghost" type="button">
            <Link href="/events">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              'Create Event'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
