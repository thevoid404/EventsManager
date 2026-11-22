'use client';

import { useTeamJoinRequests } from '@/features/teams/hooks/useTeamJoinRequests';
import { Button } from '@/components/ui/button';
import { Loader2, Check, XCircle } from 'lucide-react';

export function TeamJoinRequests({ teamId }: { teamId: string }) {
  const { data: requests, isLoading, acceptMutation, rejectMutation } = useTeamJoinRequests(teamId);

  if (isLoading) {
    return (
      <div className="py-6 flex items-center justify-center text-xs font-mono text-[#8A8A93]">
        <Loader2 className="w-4 h-4 animate-spin mr-2 text-[#FF4D00]" />
        SYNCHRONIZING APPLICANTS...
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="border border-dashed border-white/10 rounded-lg p-6 text-center text-xs font-mono text-[#8A8A93]">
        NO PENDING JOIN TRANSMISSIONS.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="border border-white/10 bg-[#09090B] rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center shadow-md"
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold text-sm text-[#F4F4F0] truncate">
                {req.userName}
              </h4>
              <span className="text-[10px] font-mono text-[#8A8A93] px-1.5 py-0.2 rounded bg-white/5 border border-white/8">
                {req.department}
              </span>
            </div>

            {req.introduction && (
              <p className="text-xs font-sans italic text-[#8A8A93] bg-[#111114] p-2.5 rounded border border-white/5">
                &ldquo;{req.introduction}&rdquo;
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => rejectMutation.mutate(req.id)}
              disabled={rejectMutation.isPending || acceptMutation.isPending}
              className="h-8 px-3 font-mono text-xs uppercase border-[#FF2E4C]/30 text-[#FF2E4C] hover:bg-[#FF2E4C]/10 gap-1.5"
            >
              {rejectMutation.isPending && rejectMutation.variables === req.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" />
                  Decline
                </>
              )}
            </Button>

            <Button
              size="sm"
              onClick={() => acceptMutation.mutate(req.id)}
              disabled={acceptMutation.isPending || rejectMutation.isPending}
              className="h-8 px-3 font-mono text-xs uppercase bg-[#C8FF00] text-[#09090B] hover:bg-[#C8FF00]/90 font-bold gap-1.5"
            >
              {acceptMutation.isPending && acceptMutation.variables === req.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
