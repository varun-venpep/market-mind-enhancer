
-- Create a function to check subscription status
CREATE OR REPLACE FUNCTION get_profile_subscription_status(user_id UUID)
RETURNS TABLE (
  plan TEXT,
  trial_ends_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.plan,
    p.trial_ends_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$;
