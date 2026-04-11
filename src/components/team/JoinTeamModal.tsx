import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface JoinTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (code: string) => Promise<boolean>;
}

export function JoinTeamModal({ open, onOpenChange, onJoin }: JoinTeamModalProps) {
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length < 4) return;
    
    setIsJoining(true);
    const success = await onJoin(code.trim());
    setIsJoining(false);
    
    if (success) {
      setCode('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Team</DialogTitle>
          <DialogDescription>
            Enter the 6-digit invite code shared with you to join an existing board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="join-code">Invite Code</Label>
            <Input
              id="join-code"
              placeholder="e.g. ab12c3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-lg font-mono tracking-widest uppercase h-12"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isJoining || !code.trim()} className="flex-1 bg-foreground text-background font-semibold">
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Team'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
