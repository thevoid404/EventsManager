'use client';

import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Sparkles, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateTeam } from '@/features/teams/hooks/useCreateTeam';
import { toast } from 'sonner';

const createTeamSchema = z.object({
  name: z.string().min(3, 'Squad name must be at least 3 characters').max(50, 'Squad name is too long'),
  maxMembers: z.coerce.number().min(2, 'Must have at least 2 members').max(20, 'Max 20 members allowed'),
  lookingFor: z.string().min(3, 'Please specify desired skills or roles').max(100),
  description: z.string().min(10, 'Mission briefing must be at least 10 characters'),
  whatsapp: z.string().min(5, 'WhatsApp contact is required'),
  facebook: z.string().min(5, 'Facebook contact is required'),
  discord: z.string().optional(),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = use(params);
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
      toast.success('Squad established // Recruitment channel open');
      router.push(`/events/${eventId}`);
    } catch {
      // error toast already handled
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Back Link */}
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A93] hover:text-[#FF4D00] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        BACK TO EVENT DISPATCH
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono tracking-widest text-[#C8FF00] uppercase font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
          SQUAD CREATION PROTOCOL // CAPTAIN ENROLLMENT
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[#F4F4F0] uppercase">
          ESTABLISH A SQUAD
        </h1>
        <p className="text-xs text-[#8A8A93]">
          Create a competitive roster, declare required roles, and recruit Southeast University operatives.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Squad Parameters */}
        <div className="rounded-xl bg-[#111114] border border-white/10 p-6 space-y-4 shadow-lg">
          <div className="text-xs font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#FF4D00]" />
            SQUAD SPECIFICATIONS
          </div>

          <div className="space-y-1.5">
            <label htmlFor="team-name" className="text-xs font-mono uppercase text-[#8A8A93]">
              Squad Name
            </label>
            <input
              id="team-name"
              placeholder="e.g. CyberVanguard // Team 01"
              autoFocus
              {...register('name')}
              className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
            />
            {errors.name && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="max-members" className="text-xs font-mono uppercase text-[#8A8A93]">
                Squad Capacity (Max Members)
              </label>
              <input
                id="max-members"
                type="number"
                min={2}
                max={20}
                {...register('maxMembers')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] focus:outline-none focus:border-[#FF4D00]"
              />
              {errors.maxMembers && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.maxMembers.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="looking-for" className="text-xs font-mono uppercase text-[#8A8A93]">
                Desired Roles / Specialty
              </label>
              <input
                id="looking-for"
                placeholder="e.g. React Frontend + ML Model Expert"
                {...register('lookingFor')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
              />
              {errors.lookingFor && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.lookingFor.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="team-desc" className="text-xs font-mono uppercase text-[#8A8A93]">
              Mission Briefing &amp; Strategy
            </label>
            <textarea
              id="team-desc"
              rows={4}
              placeholder="Outline project goals, experience level, expected schedule, and stack..."
              {...register('description')}
              className="w-full p-3 text-xs font-sans bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
            />
            {errors.description && (
              <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Contact Channels */}
        <div className="rounded-xl bg-[#111114] border border-white/10 p-6 space-y-4 shadow-lg">
          <div className="text-xs font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-[#C8FF00]" />
            COMMUNICATION CHANNELS (REVEALED TO SQUAD OPERATIVES)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="team-wa" className="text-xs font-mono uppercase text-[#8A8A93]">
                WhatsApp Contact
              </label>
              <input
                id="team-wa"
                placeholder="+8801700000000 or chat link"
                {...register('whatsapp')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
              />
              {errors.whatsapp && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.whatsapp.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="team-fb" className="text-xs font-mono uppercase text-[#8A8A93]">
                Facebook Profile / Group
              </label>
              <input
                id="team-fb"
                placeholder="https://facebook.com/..."
                {...register('facebook')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
              />
              {errors.facebook && (
                <p className="text-[11px] font-mono text-[#FF2E4C]">{errors.facebook.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="team-dc" className="text-xs font-mono uppercase text-[#8A8A93]">
                Discord Voice / Server (Optional)
              </label>
              <input
                id="team-dc"
                placeholder="https://discord.gg/..."
                {...register('discord')}
                className="w-full h-10 px-3 text-xs font-mono bg-[#18181E] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button asChild variant="outline" className="font-mono text-xs uppercase border-white/10 bg-[#18181E] text-[#F4F4F0]">
            <Link href={`/events/${eventId}`}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 px-6 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CONFIRM SQUAD CREATION'}
          </Button>
        </div>
      </form>
    </div>
  );
}
