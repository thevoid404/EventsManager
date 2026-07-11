'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCreateTeam } from '@/features/teams/hooks/useCreateTeam';
import type { CreateTeamInput } from '@/types';
import { toast } from 'sonner';

const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50, 'Team name is too long'),
  maxMembers: z.coerce.number().min(2, 'Must have at least 2 members').max(20, 'Max 20 members allowed'),
  lookingFor: z.string().min(5, 'Please specify what skills you are looking for').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  whatsapp: z.string().min(5, 'WhatsApp contact is required'),
  facebook: z.string().min(5, 'Facebook contact is required'),
  discord: z.string().optional(),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeamPage({ params }: { params: { id: string } }) {
  const { id: eventId } = params;
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateTeam(eventId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema) as any,
    defaultValues: { maxMembers: 4 },
  });

  const onSubmit = async (data: CreateTeamFormValues) => {
    try {
      const team = await mutateAsync(data);
      toast.success('Team created successfully!');
      router.push(`/events/${eventId}/teams/${team.id}`);
    } catch {
      // hook handles error toast
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href={`/events/${eventId}/teams`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Teams
      </Link>

      <div>
        <h1 className="text-xl font-semibold">Create Team</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Form a new team and find members.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Team Details
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="name">Team Name</Label>
            <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="maxMembers">Max Members</Label>
              <Input
                id="maxMembers"
                type="number"
                {...register('maxMembers')}
                aria-invalid={!!errors.maxMembers}
              />
              {errors.maxMembers && (
                <p className="text-xs text-destructive">{errors.maxMembers.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lookingFor">Looking For (Skills)</Label>
              <Input
                id="lookingFor"
                placeholder="e.g. Frontend dev, Designer..."
                {...register('lookingFor')}
                aria-invalid={!!errors.lookingFor}
              />
              {errors.lookingFor && (
                <p className="text-xs text-destructive">{errors.lookingFor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">About the Team</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="What are your goals? What is your project about?"
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Contact Info (Visible to members only)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp Number / Link</Label>
              <Input id="whatsapp" {...register('whatsapp')} aria-invalid={!!errors.whatsapp} />
              {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="facebook">Facebook Link</Label>
              <Input id="facebook" {...register('facebook')} aria-invalid={!!errors.facebook} />
              {errors.facebook && <p className="text-xs text-destructive">{errors.facebook.message}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="discord">Discord Server (Optional)</Label>
              <Input id="discord" {...register('discord')} aria-invalid={!!errors.discord} />
              {errors.discord && <p className="text-xs text-destructive">{errors.discord.message}</p>}
            </div>
          </div>
        </section>

        <Separator />

        <div className="flex justify-end gap-3 pt-2">
          <Button asChild variant="outline" type="button" disabled={isPending}>
            <Link href={`/events/${eventId}/teams`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Team'}
          </Button>
        </div>
      </form>
    </div>
  );
}
