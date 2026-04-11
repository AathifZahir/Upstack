-- Fix overlapping RLS policies for feature_requests
DROP POLICY IF EXISTS "Team members can view their requests" ON feature_requests;
DROP POLICY IF EXISTS "Leads can update/delete team requests" ON feature_requests;

-- 1. All team members can see requests in their team
CREATE POLICY "Team members can view team requests"
  ON feature_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = feature_requests.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- 2. Team members can insert requests into their team
CREATE POLICY "Team members can insert team requests"
  ON feature_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = feature_requests.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- 3. Only team leads can update or delete requests
CREATE POLICY "Leads can manage team requests"
  ON feature_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = feature_requests.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'lead'
    )
  );
