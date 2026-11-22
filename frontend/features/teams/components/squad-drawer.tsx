'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Shield,
  MessageCircle,
  Check,
  XCircle,
  Loader2,
  Send,
  ExternalLink,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Team } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useJoinRequest } from '../hooks/useJoinRequest';
import { useTeamJoinRequests } from '../hooks/useTeamJoinRequests';
import { toast } from 'sonner';

interface SquadDrawerProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
}

export function SquadDrawer({ open, onClose, team }: SquadDrawerProps) {
  const { user, isAuthenticated } = useAuth();
  const [intro, setIntro] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const teamId = team?.id || '';
  const { mutateAsync: sendRequest, isPending: isSending } = useJoinRequest(teamId);
  const {
    data: joinRequests,
    isLoading: requestsLoading,
    acceptMutation,
    rejectMutation,
  } = useTeamJoinRequests(teamId);

  if (!team) return null;

  const currentCount = team.members?.length ?? team.currentMembers ?? 1;
  const maxCount = team.maxMembers ?? 4;
  const isFull = currentCount >= maxCount;
  const openSlots = Math.max(0, maxCount - currentCount);

  const isCurrentUserMember =
    team.isCurrentUserMember ||
    team.members?.some((m) => m.userId === user?.id) ||
    team.leaderId === user?.id;

  const isLeader =
    team.isCurrentUserLeader ||
    team.leaderId === user?.id;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendRequest({ introduction: intro });
      toast.success('Transmission sent // Request queued for squad leader');
      setShowJoinForm(false);
      setIntro('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to submit join request.';
      toast.error(msg);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-md"
          />

          {/* Drawer Right Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="w-screen max-w-md bg-[#111114] border-l border-white/12 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 space-y-4 bg-[#141418]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF00] shadow-[0_0_10px_#C8FF00]" />
                    <span className="text-[10px] font-mono tracking-widest text-[#8A8A93] uppercase">
                      SQUAD ROSTER & TELEMETRY
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full border border-white/10 bg-[#18181E] flex items-center justify-center text-[#8A8A93] hover:text-[#F4F4F0] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-black tracking-tight text-[#F4F4F0]">
                    {team.name}
                  </h2>
                  <p className="text-xs text-[#8A8A93]">
                    Led by <span className="text-[#FF4D00] font-semibold">{team.leaderName || 'Squad Captain'}</span>
                  </p>
                </div>

                {/* Slot Capacity Pips */}
                <div className="p-3 rounded-lg bg-[#09090B] border border-white/8 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8A8A93]">CAPACITY RATIO:</span>
                    <span className={isFull ? 'text-[#FF2E4C] font-bold' : 'text-[#C8FF00] font-bold'}>
                      {currentCount} / {maxCount} ({isFull ? 'SQUAD FULL' : `${openSlots} SLOTS OPEN`})
                    </span>
                  </div>

                  {/* Visual Square Pips */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: maxCount }).map((_, i) => {
                      const isOccupied = i < currentCount;
                      return (
                        <div
                          key={i}
                          className={`h-2.5 flex-1 rounded-sm border transition-all ${
                            isOccupied
                              ? 'bg-[#C8FF00] border-[#C8FF00] shadow-[0_0_8px_rgba(200,255,0,0.4)]'
                              : 'bg-white/5 border-white/10'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Body Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Looking For Badge */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#FF4D00]" />
                    DESIRED RECRUITMENT SPECIALTY
                  </div>
                  <div className="p-3 rounded-lg bg-[#18181E] border border-white/10 text-xs font-mono text-[#F4F4F0]">
                    {team.lookingFor}
                  </div>
                </div>

                {/* Team Brief */}
                {team.description && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider">
                      MISSION STATEMENT
                    </div>
                    <p className="text-xs text-[#8A8A93] leading-relaxed whitespace-pre-wrap">
                      {team.description}
                    </p>
                  </div>
                )}

                {/* Members Roster */}
                <div className="space-y-2.5">
                  <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider">
                    CONFIRMED SQUAD OPERATIVES ({team.members?.length ?? 0})
                  </div>
                  <div className="space-y-2">
                    {team.members && team.members.length > 0 ? (
                      team.members.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 rounded-lg bg-[#18181E] border border-white/8 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="w-8 h-8 rounded border border-white/10">
                              <AvatarFallback className="bg-white/10 text-xs font-mono font-bold text-[#F4F4F0] rounded">
                                {member.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-heading font-bold text-[#F4F4F0] truncate flex items-center gap-1.5">
                                {member.name}
                                {member.isLeader && (
                                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/40">
                                    CAPTAIN
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] font-mono text-[#8A8A93] truncate">
                                {member.department}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-lg bg-[#18181E] text-xs font-mono text-[#8A8A93]">
                        No roster entries yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Leader Approval Queue (if current user is Leader) */}
                {isLeader && (
                  <div className="p-4 rounded-xl bg-[#141418] border border-[#FF4D00]/30 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#FF4D00] uppercase">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        CAPTAIN QUEUE // JOIN REQUESTS
                      </span>
                      <span>({joinRequests?.length ?? 0})</span>
                    </div>

                    {requestsLoading ? (
                      <div className="py-4 text-center text-xs font-mono text-[#8A8A93]">
                        Loading candidates...
                      </div>
                    ) : !joinRequests || joinRequests.length === 0 ? (
                      <p className="text-xs font-mono text-[#8A8A93] py-2 text-center">
                        NO PENDING JOIN SIGNALS.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {joinRequests.map((req) => (
                          <div
                            key={req.id}
                            className="p-3 rounded-lg bg-[#09090B] border border-white/10 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-heading font-bold text-[#F4F4F0]">
                                {req.userName}
                              </span>
                              <span className="text-[10px] font-mono text-[#8A8A93]">
                                {req.department}
                              </span>
                            </div>

                            {req.introduction && (
                              <p className="text-xs font-sans italic text-[#8A8A93] bg-[#111114] p-2 rounded border border-white/5">
                                &ldquo;{req.introduction}&rdquo;
                              </p>
                            )}

                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => acceptMutation.mutate(req.id)}
                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                className="flex-1 h-7 rounded bg-[#C8FF00] hover:bg-[#C8FF00]/90 text-[#09090B] text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1 transition-colors"
                              >
                                <Check className="w-3 h-3" />
                                ACCEPT
                              </button>
                              <button
                                onClick={() => rejectMutation.mutate(req.id)}
                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                className="flex-1 h-7 rounded bg-[#FF2E4C]/20 hover:bg-[#FF2E4C]/30 text-[#FF2E4C] border border-[#FF2E4C]/40 text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-1 transition-colors"
                              >
                                <XCircle className="w-3 h-3" />
                                DECLINE
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Team Contact Channels (Visible to members) */}
                {isCurrentUserMember && (
                  <div className="p-4 rounded-xl bg-[#141418] border border-white/10 space-y-2.5">
                    <div className="text-[10px] font-mono text-[#8A8A93] uppercase tracking-wider flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#C8FF00]" />
                      COMMUNICATION CHANNELS
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      {team.whatsapp && (
                        <a
                          href={team.whatsapp.startsWith('http') ? team.whatsapp : `https://wa.me/${team.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded bg-[#18181E] border border-white/5 hover:border-white/20 text-[#25D366] transition-colors"
                        >
                          <span>WhatsApp Comms</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {team.facebook && (
                        <a
                          href={team.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded bg-[#18181E] border border-white/5 hover:border-white/20 text-[#1877F2] transition-colors"
                        >
                          <span>Facebook Squad Group</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {team.discord && (
                        <a
                          href={team.discord}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded bg-[#18181E] border border-white/5 hover:border-white/20 text-[#5865F2] transition-colors"
                        >
                          <span>Discord Voice / Channel</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-white/10 bg-[#141418]">
                {isCurrentUserMember ? (
                  <div className="p-2.5 rounded-lg bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-xs font-mono text-[#C8FF00] font-bold text-center flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    YOU ARE ENROLLED IN THIS SQUAD
                  </div>
                ) : isFull ? (
                  <div className="p-2.5 rounded-lg bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 text-xs font-mono text-[#FF2E4C] font-bold text-center">
                    MAXIMUM SQUAD CAPACITY REACHED
                  </div>
                ) : !isAuthenticated ? (
                  <Button asChild className="w-full h-10 font-mono text-xs uppercase bg-[#FF4D00] text-white">
                    <a href="/login">SIGN IN WITH @SEU.EDU.BD TO JOIN</a>
                  </Button>
                ) : showJoinForm ? (
                  <form onSubmit={handleJoin} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#8A8A93] uppercase">
                        INTRODUCTORY NOTE (OPTIONAL)
                      </label>
                      <textarea
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder="State your tech stack, role, or portfolio..."
                        rows={3}
                        className="w-full p-2.5 text-xs font-mono bg-[#09090B] border border-white/10 rounded-md text-[#F4F4F0] placeholder-[#8A8A93]/50 focus:outline-none focus:border-[#FF4D00]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJoinForm(false)}
                        className="flex-1 font-mono text-xs border-white/10 text-[#8A8A93]"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSending}
                        className="flex-1 font-mono text-xs uppercase bg-[#FF4D00] text-white font-bold gap-1.5"
                      >
                        {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        Transmit Request
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    onClick={() => setShowJoinForm(true)}
                    className="w-full h-10 font-mono text-xs uppercase tracking-wider bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 font-bold gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                    REQUEST TO JOIN SQUAD ({openSlots} SLOTS LEFT)
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
