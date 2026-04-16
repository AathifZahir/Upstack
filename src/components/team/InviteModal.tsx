import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  inviteCode: string;
}

export function InviteModal({ open, onOpenChange, teamName, inviteCode }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const inviteLink = `${window.location.origin}/join/${inviteCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSending(true);
    // In a real app, this would call a Supabase Edge Function or backend
    setTimeout(() => {
      toast.success(`Invite sent to ${email}`);
      setEmail('');
      setIsSending(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {teamName}</DialogTitle>
          <DialogDescription>
            Share this code or link with your teammates to let them join your board.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Invite Code</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-dashed border-border bg-muted/30 p-2 text-center text-xl font-mono font-bold tracking-[0.2em] uppercase">
                {inviteCode}
              </div>
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(inviteCode)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or send email</span>
            </div>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                placeholder="colleague@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isSending}>
                <Mail className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
          </form>

          <div className="rounded-lg bg-accent/20 p-3 text-xs text-muted-foreground">
            Anyone with the code can join as a member and see all ideas in this team.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
