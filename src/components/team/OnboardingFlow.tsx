import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useTeams } from '@/hooks/use-teams';
import { APP_NAME } from '@/lib/constants';

interface OnboardingFlowProps {
  userId: string;
  onComplete: (teamId: string | null) => void;
}

export function OnboardingFlow({ userId, onComplete }: OnboardingFlowProps) {
  const { createTeam, joinTeam } = useTeams(userId);
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setIsSubmitting(true);
    const team = await createTeam(teamName);
    setIsSubmitting(false);
    if (team) onComplete(team.id);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setIsSubmitting(true);
    const team = await joinTeam(inviteCode);
    setIsSubmitting(false);
    if (team) onComplete(team.id);
  };

  const handlePersonal = () => {
    onComplete(null);
  };

  if (mode === 'create') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle>Create a team</CardTitle>
            <CardDescription>Give your team a name to start collecting feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                placeholder="Team Name (e.g. Acme Product)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => setMode('select')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-foreground text-background">
                  {isSubmitting ? 'Creating...' : 'Create Team'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle>Join a team</CardTitle>
            <CardDescription>Enter the 6-digit invite code shared by your lead.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                placeholder="Invite Code (e.g. ab12c3)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                autoFocus
                required
                className="text-center text-lg font-mono tracking-widest uppercase"
              />
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => setMode('select')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-foreground text-background">
                  {isSubmitting ? 'Joining...' : 'Join Team'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to {APP_NAME}
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Before we begin, how would you like to set up your board?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setMode('create')}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
          >
            <div className="mb-4 rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
              <Plus className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Create Team</h3>
              <p className="mt-2 text-sm text-muted-foreground">For products or teams collecting collaborative feedback.</p>
            </div>
            <ArrowRight className="mt-6 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
          </button>

          <button
            onClick={() => setMode('join')}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
          >
            <div className="mb-4 rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Join Team</h3>
              <p className="mt-2 text-sm text-muted-foreground">Request access to an existing board via invite code.</p>
            </div>
            <ArrowRight className="mt-6 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
          </button>

          <button
            onClick={handlePersonal}
            disabled={isSubmitting}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
          >
            <div className="mb-4 rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Personal Space</h3>
              <p className="mt-2 text-sm text-muted-foreground">A private board for your own project ideas and tracking.</p>
            </div>
            <ArrowRight className="mt-6 h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
