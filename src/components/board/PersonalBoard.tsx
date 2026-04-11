import { Team } from '@/hooks/use-teams';
import { FeatureRequest } from '@/hooks/use-feature-requests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Folder, ArrowRight, Activity, MessageSquare } from 'lucide-react';
import { FeatureRequestCard } from './FeatureRequestCard';
import { VoteState } from './UpvoteButton';

interface PersonalBoardProps {
  userName: string | null;
  teams: Team[];
  myRequests: FeatureRequest[];
  supportedRequests: FeatureRequest[];
  onTeamSelect: (teamId: string) => void;
  onCreateTeam: () => void;
  onJoinTeam: () => void;
  onVote: (requestId: string, voteType: 'up' | 'down') => Promise<void>;
  getVoteState: (requestId: string) => VoteState;
}

export function PersonalBoard({
  userName,
  teams,
  myRequests,
  supportedRequests,
  onTeamSelect,
  onCreateTeam,
  onJoinTeam,
  onVote,
  getVoteState
}: PersonalBoardProps) {
  const filteredSupported = supportedRequests;

  return (
    <div className="space-y-12 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome back, {userName?.split(' ')[0] ?? 'Explorer'}
        </h1>
        <p className="text-lg text-muted-foreground">
          Here's what's happening across your teams and ideas.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Joined Teams</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active collaborations
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Published Ideas</CardTitle>
            <MessageSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all boards
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Supported Ideas</CardTitle>
            <Plus className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSupported.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Voted for
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teams Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">My Teams</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onJoinTeam} className="text-xs text-muted-foreground hover:text-foreground">
              Join with code
            </Button>
            <Button variant="outline" size="sm" onClick={onCreateTeam} className="text-xs gap-1.5 h-8">
              <Plus className="h-3.5 w-3.5" />
              New Team
            </Button>
          </div>
        </div>

        {teams.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground font-medium">You haven't joined any teams yet.</p>
              <Button variant="link" onClick={onJoinTeam} className="mt-2">
                Join your first team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => onTeamSelect(team.id)}
                className="group relative flex flex-col items-start rounded-xl border border-border/60 bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-lg font-bold">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-foreground">{team.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1 uppercase tracking-wider font-medium">
                  {team.user_role === 'lead' ? 'Owner / Lead' : 'Member'}
                </p>
                <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/40 pb-4">
            <Activity className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">My Published Ideas</h2>
          </div>

          {myRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-card/30 rounded-2xl border border-border/40">
              <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-medium">No ideas yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                Switch to a team board to start sharing your thoughts.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {myRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="relative group">
                  <FeatureRequestCard
                    request={request}
                    onVote={onVote}
                    voteState={getVoteState(request.id)}
                    className="border-border/60"
                  />
                  <div className="absolute top-4 right-16 hidden sm:block">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-secondary/50 px-2 py-0.5 rounded">
                      {teams.find(t => t.id === request.team_id)?.name ?? 'Team'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Supported Ideas Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/40 pb-4">
            <Plus className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Ideas I Support</h2>
          </div>

          {filteredSupported.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-card/30 rounded-2xl border border-border/40">
              <Plus className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-medium">No supported ideas</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                Ideas you vote for will appear here for easy tracking.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSupported.slice(0, 5).map((request) => (
                <div key={request.id} className="relative group">
                  <FeatureRequestCard
                    request={request}
                    onVote={onVote}
                    voteState={getVoteState(request.id)}
                    className="border-border/60"
                  />
                  <div className="absolute top-4 right-16 hidden sm:block">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-secondary/50 px-2 py-0.5 rounded">
                      {teams.find(t => t.id === request.team_id)?.name ?? 'Team'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
