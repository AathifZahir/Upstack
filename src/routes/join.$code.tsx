import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTeams } from '@/hooks/use-teams';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/join/$code')({
  component: JoinTeamPage,
});

function JoinTeamPage() {
  const { code } = Route.useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { joinTeam } = useTeams(user?.id ?? null);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.info('Please sign in to join the team');
      navigate({ to: '/' });
      return;
    }

    const performJoin = async () => {
      setIsProcessing(true);
      const team = await joinTeam(code);
      setIsProcessing(false);
      
      if (team) {
        localStorage.setItem('activeTeamId', team.id);
        navigate({ to: '/' });
      } else {
        navigate({ to: '/' });
      }
    };

    performJoin();
  }, [code, user, authLoading, joinTeam, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Joining team...</p>
      </div>
    </div>
  );
}
