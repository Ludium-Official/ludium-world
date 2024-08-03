-- public.reward_claim_detail definition

-- Drop table

-- DROP TABLE public.reward_claim_detail;

CREATE TABLE public.reward_claim_detail (
	id uuid NOT NULL,
	reward_claim_id uuid NOT NULL,
	transaction_hash varchar(100) NOT NULL, -- 전송 트랜잭션 해시 값
	sended_user_id uuid NOT NULL, -- 보낸 사용자 user id
	sended_user_address varchar(100) NOT NULL, -- 보낸 사용자 지갑 주소
	created_date timestamp DEFAULT now() NOT NULL,
	updated_date timestamp DEFAULT now() NOT NULL,
	CONSTRAINT reward_claim_detail_pk PRIMARY KEY (id),
	CONSTRAINT reward_claim_detail_fk_reward_claim FOREIGN KEY (reward_claim_id) REFERENCES public.reward_claim(id)
);

-- Column comments

COMMENT ON COLUMN public.reward_claim_detail.transaction_hash IS '전송 트랜잭션 해시 값';
COMMENT ON COLUMN public.reward_claim_detail.sended_user_id IS '보낸 사용자 user id';
COMMENT ON COLUMN public.reward_claim_detail.sended_user_address IS '보낸 사용자 지갑 주소';