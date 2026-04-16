import { useState } from 'react';
import { Plus, LogOut, Menu, UserPlus } from 'lucide-react';
import { AppLogo } from '@/components/brand/AppLogo';
import { InviteModal } from '@/components/team/InviteModal';
import { TeamSwitcher } from './TeamSwitcher';
import { Team } from '@/hooks/use-teams';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface HeaderProps {
  userName: string | null;
  isAdmin: boolean;
  onSubmitClick: () => void;
  onSignOut: () => void;
  teams: Team[];
  currentTeam: Team | null;
  onTeamSelect: (teamId: string | null) => void;
  onCreateNew: () => void;
}

export function Header({ userName, isAdmin, onSubmitClick, onSignOut, teams, currentTeam, onTeamSelect, onCreateNew }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-4 sm:px-6 md:max-w-5xl">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-none sm:flex-none sm:gap-4">
          <button 
            onClick={() => onTeamSelect(null)}
            className="transition-opacity hover:opacity-80 active:scale-95"
            title="Personal Board"
          >
            <AppLogo size="md" variant="light" />
          </button>
          <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />
          <TeamSwitcher
            teams={teams}
            currentTeam={currentTeam}
            onSelect={onTeamSelect}
            onCreateNew={onCreateNew}
            onManageTeam={() => setInviteOpen(true)}
          />
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          {currentTeam && isAdmin && (
            <button
              onClick={() => setInviteOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mr-1"
              title="Invite Teammates"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
          <Button onClick={onSubmitClick} size="sm" className="gap-1.5 bg-foreground text-background font-semibold hover:opacity-90">
            <Plus className="h-4 w-4" />
            Submit idea
          </Button>
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-muted-foreground">
              {userName ?? 'User'}
              {isAdmin && (
                <span className="ml-1.5 rounded-[8px] bg-admin-badge px-1.5 py-0.5 text-[10px] font-semibold text-admin-badge-foreground">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={onSignOut}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex sm:hidden items-center gap-2">
          {currentTeam && isAdmin && (
            <button
              onClick={() => setInviteOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
          <Button onClick={onSubmitClick} size="sm" className="gap-1.5 h-9 px-3 bg-foreground text-background font-semibold hover:opacity-90">
            <Plus className="h-4 w-4" />
          </Button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{userName ?? 'User'}</p>
              {isAdmin && (
                <span className="inline-block rounded-[8px] bg-admin-badge px-1.5 py-0.5 text-[10px] font-semibold text-admin-badge-foreground">
                  Admin
                </span>
              )}
            </div>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onSubmitClick();
              }}
              className="w-full gap-1.5 bg-foreground text-background font-semibold hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Submit idea
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="w-full gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {currentTeam && (
        <InviteModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          teamName={currentTeam.name}
          inviteCode={currentTeam.invite_code}
        />
      )}
    </header>
  );
}
