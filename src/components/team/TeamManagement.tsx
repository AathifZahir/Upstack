import { useState, useEffect } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { Button } from '@/components/ui/button';
import { UserPlus, Star } from 'lucide-react';
import { InviteModal } from './InviteModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamManagementProps {
  teamId: string;
  inviteCode: string;
  isLead: boolean;
}

export function TeamManagement({ teamId, inviteCode, isLead }: TeamManagementProps) {
  const { getTeamMembers } = useTeams(null);
  const [members, setMembers] = useState<any[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      const data = await getTeamMembers(teamId);
      setMembers(data);
      setIsLoading(false);
    };
    fetchMembers();
  }, [teamId]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border/50 mb-6 group">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-secondary animate-pulse border-2 border-background" />
          ) : (
            members.slice(0, 5).map((member) => (
              <TooltipProvider key={member.user_id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary ring-offset-background transition-all hover:scale-110 hover:z-10 cursor-default">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      {member.role === 'lead' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 border border-background">
                                <Star className="h-2 w-2 text-white fill-white" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Team Lead</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-medium">{member.name}</p>
                    <p className="text-[10px] opacity-70 capitalize">{member.role}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          )}
          {members.length > 5 && (
            <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              +{members.length - 5}
            </div>
          )}
        </div>
        {!isLoading && (
          <span className="text-sm font-medium text-muted-foreground ml-1">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setInviteOpen(true)}
        className="h-9 gap-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground border-dashed border-2 hover:border-solid transition-all"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Invite Teammates
      </Button>

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        inviteCode={inviteCode}
      />
    </div>
  );
}
