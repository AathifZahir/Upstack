import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  invite_code: string;
  created_at: string;
  user_role?: 'lead' | 'member';
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'lead' | 'member';
}

export function useTeams(userId: string | null) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    if (!userId) {
      setTeams([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Fetch teams where user is a member
    const { data: team_meta, error } = await supabase
      .from('team_members')
      .select('role, team:teams(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching teams:', error);
      setIsLoading(false);
      return;
    }

    const userTeams = (team_meta?.map(d => ({
      ...(d.team as unknown as Team),
      user_role: d.role
    })) as Team[]) || [];
    setTeams(userTeams);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = async (name: string) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name,
        owner_id: userId,
      })
      .select()
      .maybeSingle();

    if (error) {
      toast.error('Failed to create team');
      return null;
    }

    toast.success(`Team "${name}" created!`);
    fetchTeams();
    return data;
  };

  const joinTeam = async (inviteCode: string) => {
    if (!userId) return null;

    // 1. Find the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('invite_code', inviteCode)
      .maybeSingle();

    if (teamError || !team) {
      toast.error('Invalid invite code');
      return null;
    }

    // 2. Join the team
    const { error: joinError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: userId,
        role: 'member',
      });

    if (joinError) {
      if (joinError.code === '23505') {
        toast.info('You are already a member of this team');
        return team;
      }
      toast.error('Failed to join team');
      return null;
    }

    toast.success(`Joined team "${team.name}"!`);
    fetchTeams();
    return team;
  };

  const deleteTeam = async (teamId: string) => {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (error) {
      toast.error('Failed to delete team');
      return false;
    }

    toast.success('Team deleted successfully');
    fetchTeams();
    return true;
  };

  const removeMember = async (teamId: string, userIdToRemove: string) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userIdToRemove);

    if (error) {
      toast.error('Failed to remove member');
      return false;
    }

    toast.success('Member removed');
    return true;
  };

  const getTeamMembers = async (teamId: string) => {
    // 1. Fetch team members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('user_id, role')
      .eq('team_id', teamId);

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return [];
    }

    if (!members || members.length === 0) return [];

    // 2. Fetch profiles for these users
    const userIds = members.map(m => m.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, name, email')
      .in('user_id', userIds);

    if (profilesError) {
      console.error('Error fetching member profiles:', profilesError);
      // Return members anyway but with unknown names
      return members.map(m => ({
        user_id: m.user_id,
        role: m.role as 'lead' | 'member',
        name: 'Unknown User',
        email: ''
      }));
    }

    // 3. Join in-memory
    return members.map(m => {
      const profile = profiles?.find(p => p.user_id === m.user_id);
      return {
        user_id: m.user_id,
        role: m.role as 'lead' | 'member',
        name: profile?.name ?? 'Unknown User',
        email: profile?.email ?? ''
      };
    });
  };

  return { teams, isLoading, createTeam, joinTeam, deleteTeam, removeMember, getTeamMembers, refetch: fetchTeams };
}
