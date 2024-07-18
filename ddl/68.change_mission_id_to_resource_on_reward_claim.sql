-- Add resource_type 
CREATE TYPE resource_type AS ENUM ('MISSION', 'DETAILED_POSTING');

-- Drop the existing unique constraint
ALTER TABLE public.reward_claim DROP CONSTRAINT unique_mission_user;

-- Add resource_type and resource_id columns
ALTER TABLE public.reward_claim
ADD COLUMN resource_type resource_type NOT NULL DEFAULT 'MISSION',
ADD COLUMN resource_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- Update the existing columns to move data from mission_id to resource_id
UPDATE public.reward_claim SET resource_id = mission_id, resource_type = 'MISSION';

-- Drop the old mission_id column
ALTER TABLE public.reward_claim DROP COLUMN mission_id;

-- Add the new unique constraint for resource_type, resource_id, and user_id
ALTER TABLE public.reward_claim
ADD CONSTRAINT unique_resource_user UNIQUE (resource_type, resource_id, user_id);
