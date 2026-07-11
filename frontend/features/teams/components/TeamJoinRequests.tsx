'use client';

import { useTeamJoinRequests } from '@/features/teams/hooks/useTeamJoinRequests';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function TeamJoinRequests({ teamId }: { teamId: string }) {
  const { data: requests, isLoading, acceptMutation, rejectMutation } = useTeamJoinRequests(teamId);

  if (isLoading) {
    return <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">Loading requests...</div>;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
        No pending join requests.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <div>
            <h4 className="font-semibold text-sm">{req.userName}</h4>
            <p className="text-xs text-muted-foreground">{req.department}</p>
            {req.introduction && (
              <p className="mt-2 text-sm italic border-l-2 pl-2 text-muted-foreground">"{req.introduction}"</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => rejectMutation.mutate(req.id)}
              disabled={rejectMutation.isPending || acceptMutation.isPending}
            >
              {rejectMutation.isPending && rejectMutation.variables === req.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><XCircle className="h-4 w-4 mr-1.5" /> Reject</>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => acceptMutation.mutate(req.id)}
              disabled={acceptMutation.isPending || rejectMutation.isPending}
            >
              {acceptMutation.isPending && acceptMutation.variables === req.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><CheckCircle className="h-4 w-4 mr-1.5" /> Accept</>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
