import { useState } from 'react';
import { useTeams } from '@/hooks/use-teams';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Shield, 
  User as UserIcon,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ManageMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  members: any[];
  onMemberRemoved: () => void;
  currentUserId: string | undefined;
}

export function ManageMembersModal({
  open,
  onOpenChange,
  teamId,
  members,
  onMemberRemoved,
  currentUserId
}: ManageMembersModalProps) {
  const { removeMember } = useTeams(currentUserId ?? null);
  const [memberToRemove, setMemberToRemove] = useState<any | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveClick = (member: any) => {
    if (member.user_id === currentUserId) {
      toast.error("You cannot remove yourself from the team here.");
      return;
    }
    setMemberToRemove(member);
  };

  const confirmRemove = async () => {
    if (!memberToRemove) return;
    
    setIsRemoving(true);
    const success = await removeMember(teamId, memberToRemove.user_id);
    setIsRemoving(false);
    
    if (success) {
      onMemberRemoved();
      setMemberToRemove(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Members</DialogTitle>
            <DialogDescription>
              View and manage the people who have access to this team board.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {members.map((member) => (
              <div key={member.user_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold flex items-center gap-1.5">
                      {member.name}
                      {member.role === 'lead' && (
                        <Badge variant="secondary" className="h-4 px-1 text-[8px] uppercase tracking-wider bg-admin-badge text-admin-badge-foreground hover:bg-admin-badge border-admin-badge-border">
                          <Shield className="h-2 w-2 mr-0.5 fill-admin-badge-foreground" />
                          Lead
                        </Badge>
                      )}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{member.email}</span>
                  </div>
                </div>
                
                {member.user_id !== currentUserId && member.role !== 'lead' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveClick(member)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                {member.user_id === currentUserId && (
                  <span className="text-[10px] font-medium text-muted-foreground italic px-2">You</span>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Remove teammate?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{memberToRemove?.name}</span> from this team?
              They will lose access to all boards and feedback associated with this team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                confirmRemove();
              }}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove Member'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
