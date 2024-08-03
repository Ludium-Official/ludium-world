ALTER TABLE public.reward_claim ALTER COLUMN "reward_claim_status" TYPE text USING "reward_claim_status"::text;
ALTER TABLE public.reward_claim ALTER COLUMN "reward_claim_status" SET DEFAULT '';
DROP TYPE public."reward_claim_status";
CREATE type reward_claim_status AS ENUM ('READY', 'TRANSACTION_APPROVED', 'TRANSACTION_FAILED');
ALTER TABLE public.reward_claim ALTER COLUMN "reward_claim_status" SET DEFAULT 'READY'::reward_claim_status;
ALTER TABLE public.reward_claim ALTER COLUMN "reward_claim_status" TYPE public."reward_claim_status" USING "reward_claim_status"::text::public."reward_claim_status";
ALTER TABLE public.reward_claim ALTER COLUMN amount TYPE numeric USING amount::numeric;
ALTER TABLE public.reward_claim ADD CONSTRAINT unique_mission_user UNIQUE (mission_id,user_id);