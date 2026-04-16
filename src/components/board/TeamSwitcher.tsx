import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Team } from '@/hooks/use-teams';

interface TeamSwitcherProps {
  teams: Team[];
  currentTeam: Team | null;
  onSelect: (teamId: string | null) => void;
  onCreateNew: () => void;
  onManageTeam?: (teamId: string) => void;
}

export function TeamSwitcher({ teams, currentTeam, onSelect, onCreateNew, onManageTeam }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-9 min-w-0 max-w-[min(200px,calc(100vw-10.5rem))] shrink justify-between px-2 hover:bg-secondary/50 group sm:h-10 sm:w-[200px] sm:max-w-none"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[10px] font-bold text-muted-foreground group-hover:border-foreground/20 group-hover:text-foreground">
              {currentTeam?.name.substring(0, 2).toUpperCase() || 'PB'}
            </div>
            <span className="truncate font-semibold text-foreground">
              {currentTeam?.name || 'Personal Board'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search boards..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Personal">
              <CommandItem
                onSelect={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className="flex items-center justify-between py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[9px] font-bold">
                    PB
                  </div>
                  <span className="truncate">Personal Overview</span>
                </div>
                {!currentTeam && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Teams">
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => {
                    onSelect(team.id);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-background text-[9px] font-bold">
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="truncate">{team.name}</span>
                  </div>
                  {currentTeam?.id === team.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  onCreateNew();
                }}
                className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Team</span>
              </CommandItem>
              {currentTeam?.user_role === 'lead' && (
                 <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    onManageTeam?.(currentTeam.id);
                  }}
                  className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  <span>Invite Teammates</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
