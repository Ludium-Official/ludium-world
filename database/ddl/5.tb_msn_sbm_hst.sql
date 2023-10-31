-- public.tb_msn_sbm_hst definition

-- Drop table

-- DROP TABLE public.tb_msn_sbm_hst;

CREATE TABLE public.tb_msn_sbm_hst (
	id uuid NOT NULL, -- 아이디
	msn_sbm_id uuid NOT NULL, -- 미션 제출 아이디
	"content" text NOT NULL, -- 내용
	create_at timestamptz NOT NULL, -- 생성 일시
	CONSTRAINT tb_msn_sbm_hst_pk PRIMARY KEY (id),
	CONSTRAINT tb_msn_sbm_hst_fk FOREIGN KEY (msn_sbm_id) REFERENCES public.tb_msn_sbm(id)
);
COMMENT ON TABLE public.tb_msn_sbm_hst IS '미션 제출 이력';

-- Column comments

COMMENT ON COLUMN public.tb_msn_sbm_hst.id IS '아이디';
COMMENT ON COLUMN public.tb_msn_sbm_hst.msn_sbm_id IS '미션 제출 아이디';
COMMENT ON COLUMN public.tb_msn_sbm_hst."content" IS '내용';
COMMENT ON COLUMN public.tb_msn_sbm_hst.create_at IS '생성 일시';