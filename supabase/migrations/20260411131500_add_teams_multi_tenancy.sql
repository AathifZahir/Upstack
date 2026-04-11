
-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 6),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('lead', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Add team_id to feature_requests
ALTER TABLE public.feature_requests ADD COLUMN team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they are members of" ON public.teams
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.teams.id AND user_id = auth.uid()
    ) OR owner_id = auth.uid()
  );

CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Leads can update their teams" ON public.teams
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Members are viewable by team members" ON public.team_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = public.team_members.team_id AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Leads can manage team members" ON public.team_members
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = public.team_members.team_id AND owner_id = auth.uid()
    )
  );

-- Function to handle auto-membership on team creation
CREATE OR REPLACE FUNCTION public.handle_new_team()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'lead');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_team_created
  AFTER INSERT ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_team();

-- Update feature_requests RLS
DROP POLICY "Feature requests are viewable by authenticated users" ON public.feature_requests;
CREATE POLICY "Feature requests viewable by team members" ON public.feature_requests
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.feature_requests.team_id AND user_id = auth.uid()
    )
  );

DROP POLICY "Authenticated users can submit requests" ON public.feature_requests;
CREATE POLICY "Users can submit requests to their teams" ON public.feature_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = public.feature_requests.team_id AND user_id = auth.uid()
    )
  );

-- Data Migration: Group existing requests into a default team for the first user if any exists
DO $$
DECLARE
  first_user_id UUID;
  default_team_id UUID;
BEGIN
  SELECT user_id INTO first_user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1;
  IF first_user_id IS NULL THEN
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;
  END IF;

  IF first_user_id IS NOT NULL THEN
    INSERT INTO public.teams (name, owner_id) VALUES ('Welcome Team', first_user_id) RETURNING id INTO default_team_id;
    UPDATE public.feature_requests SET team_id = default_team_id WHERE team_id IS NULL;
  END IF;
END $$;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
