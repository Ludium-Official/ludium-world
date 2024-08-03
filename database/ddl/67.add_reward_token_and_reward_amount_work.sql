ALTER TABLE public.detailed_posting ADD reward_token uuid NULL;
ALTER TABLE public.detailed_posting ADD reward_amount numeric NULL;
COMMENT ON COLUMN public.detailed_posting.reward_token IS '보상 토큰';
COMMENT ON COLUMN public.detailed_posting.reward_amount IS '보상 금액';
ALTER TABLE public.detailed_posting ADD CONSTRAINT detailed_posting_coin_network_fk FOREIGN KEY (reward_token) REFERENCES public.coin_network(id);