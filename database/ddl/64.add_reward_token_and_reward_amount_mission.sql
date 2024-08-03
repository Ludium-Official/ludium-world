ALTER TABLE public.mission ADD reward_token uuid NULL;
COMMENT ON COLUMN public.mission.reward_token IS '보상 토큰';
ALTER TABLE public.mission ADD reward_amount int8 NULL;
COMMENT ON COLUMN public.mission.reward_amount IS '보상 금액';
ALTER TABLE public.mission ADD CONSTRAINT mission_coin_network_fk FOREIGN KEY (reward_token) REFERENCES public.coin_network(id);