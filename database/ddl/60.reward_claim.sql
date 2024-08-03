-- public.reward_claim definition

-- Drop table

-- DROP TABLE public.reward_claim;

CREATE TABLE public.reward_claim (
	id uuid NOT NULL,
	mission_id uuid NOT NULL,
	coin_network_id uuid NOT NULL,
	reward_claim_status public.reward_claim_status DEFAULT 'READY'::reward_claim_status NOT NULL,
	amount numeric(20, 5) NOT NULL, -- 청구 금액
	user_id uuid NOT NULL, -- 받을 사용자 user id
	user_address varchar(100) NOT NULL, -- 받을 사용자 지갑 주소
	created_date timestamp DEFAULT now() NOT NULL,
	updated_date timestamp DEFAULT now() NOT NULL,
	CONSTRAINT reward_claim_pk PRIMARY KEY (id)
);

-- Column comments

COMMENT ON COLUMN public.reward_claim.amount IS '청구 금액';
COMMENT ON COLUMN public.reward_claim.user_id IS '받을 사용자 user id';
COMMENT ON COLUMN public.reward_claim.user_address IS '받을 사용자 지갑 주소';