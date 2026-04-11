import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useFeatureRequests } from '@/hooks/use-feature-requests';
import { useVotes } from '@/hooks/use-votes';
import { Header } from '@/components/board/Header';
import { FilterBar } from '@/components/board/FilterBar';
import { FeatureRequestCard } from '@/components/board/FeatureRequestCard';
import { SubmitRequestModal } from '@/components/board/SubmitRequestModal';
import { EmptyState } from '@/components/board/EmptyState';
import { Loader2 } from 'lucide-react';
import { useTeams } from '@/hooks/use-teams';
import { OnboardingFlow } from '@/components/team/OnboardingFlow';
import { CreateTeamModal } from '@/components/team/CreateTeamModal';
import { LandingPage } from '@/components/landing/LandingPage';
import { Toaster } from '@/components/ui/sonner';
import { PersonalBoard } from '@/components/board/PersonalBoard';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { user, isLoading: authLoading, isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'date'>('votes');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeTeamId');
    }
    return null;
  });
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('upstack_onboarding_dismissed') === 'true';
    }
    return false;
  });

  const { teams, isLoading: teamsLoading, createTeam, joinTeam } = useTeams(user?.id ?? null);
  
  const currentTeam = teams.find(t => t.id === activeTeamId) || null;
  const isTeamLead = currentTeam?.user_role === 'lead';
  // Combine global admin with team lead for management features
  const canManageBoard = isAdmin || isTeamLead;

  const { requests: myRequests, isLoading: myLoading } = useFeatureRequests({
    userId: user?.id ?? null,
  });

  const { requests: supportedRequests, isLoading: supportedLoading } = useFeatureRequests({
    votedByUserId: user?.id ?? null,
  });

  const { requests, isLoading } = useFeatureRequests({
    statusFilter,
    categoryFilter,
    searchQuery,
    sortBy,
    teamId: currentTeam?.id ?? null,
  });

  const { handleVote, getVoteState } = useVotes(user?.id ?? null);

  if (authLoading || (user && (teamsLoading || myLoading || supportedLoading))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage />
        <Toaster />
      </>
    );
  }

  if (teams.length === 0 && !onboardingDismissed) {
    return (
      <div className="min-h-screen bg-background">
        <OnboardingFlow
          userId={user.id}
          onComplete={(teamId) => {
            if (teamId) {
              setActiveTeamId(teamId);
              localStorage.setItem('activeTeamId', teamId);
            } else {
              setOnboardingDismissed(true);
              localStorage.setItem('upstack_onboarding_dismissed', 'true');
            }
          }}
        />
        <Toaster />
      </div>
    );
  }

  const handleTeamChange = (id: string | null) => {
    setActiveTeamId(id);
    if (id) {
      localStorage.setItem('activeTeamId', id);
    } else {
      localStorage.removeItem('activeTeamId');
    }
  };

  const hasFilters = Boolean(statusFilter || categoryFilter || searchQuery);

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header
          userName={profile?.name ?? null}
          isAdmin={canManageBoard}
          onSubmitClick={() => setSubmitOpen(true)}
          onSignOut={signOut}
          teams={teams}
          currentTeam={currentTeam}
          onTeamSelect={handleTeamChange}
          onCreateNew={() => setCreateTeamOpen(true)}
        />

        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-4 sm:py-6">
          {!activeTeamId ? (
            <PersonalBoard
              userName={profile?.name ?? null}
              teams={teams}
              myRequests={myRequests}
              supportedRequests={supportedRequests}
              onTeamSelect={handleTeamChange}
              onCreateTeam={() => setCreateTeamOpen(true)}
              onJoinTeam={() => {
                const code = prompt('Enter 6-digit invite code:');
                if (code) joinTeam(code);
              }}
              onVote={handleVote}
              getVoteState={(id) => getVoteState(id, [...myRequests, ...supportedRequests].find(r => r.id === id)?.vote_state ?? null)}
            />
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {currentTeam?.name} Board
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Vote on the ideas you support. Submit new ideas to help prioritize what we build next.
                </p>
              </div>

              <FilterBar
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : requests.length === 0 ? (
                  <EmptyState
                    hasFilters={hasFilters}
                    onClearFilters={() => {
                      setStatusFilter(null);
                      setCategoryFilter(null);
                      setSearchQuery('');
                    }}
                    onSubmit={() => setSubmitOpen(true)}
                  />
                ) : (
                  requests.map(request => (
                    <FeatureRequestCard
                      key={request.id}
                      request={request}
                      voteState={getVoteState(request.id, request.vote_state)}
                      onVote={handleVote}
                      onClick={(id) => navigate({ to: '/request/$requestId', params: { requestId: id } })}
                      canVote={true}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </main>

        {currentTeam && (
          <SubmitRequestModal
            open={submitOpen}
            onOpenChange={setSubmitOpen}
            userId={user.id}
            teamId={currentTeam.id}
          />
        )}

        <CreateTeamModal
          open={createTeamOpen}
          onOpenChange={setCreateTeamOpen}
          onCreate={async (name) => {
            const team = await createTeam(name);
            if (team) handleTeamChange(team.id);
          }}
        />
      </div>
      <Toaster />
    </>
  );
}
