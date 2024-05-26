-- public.tb_msn_sbm_cm definition

-- Drop table

-- DROP TABLE public.tb_msn_sbm_cm;

CREATE TABLE public.tb_msn_sbm_cm (
	id uuid NOT NULL, -- 아이디
	"content" text NOT NULL, -- 내용
	msn_sbm_id uuid NOT NULL, -- 미션 제출 아이디
	usr_id uuid NOT NULL, -- 사용자 아이디
	create_at timestamptz NOT NULL, -- 생성 일시
	CONSTRAINT tb_msn_sbm_cm_pk PRIMARY KEY (id),
	CONSTRAINT tb_msn_sbm_cm_fk FOREIGN KEY (msn_sbm_id) REFERENCES public.tb_msn_sbm(id),
	CONSTRAINT tb_msn_sbm_cm_fk_1 FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);
COMMENT ON TABLE public.tb_msn_sbm_cm IS '미션 제출 댓글';

-- Column comments

COMMENT ON COLUMN public.tb_msn_sbm_cm.id IS '아이디';
COMMENT ON COLUMN public.tb_msn_sbm_cm."content" IS '내용';
COMMENT ON COLUMN public.tb_msn_sbm_cm.msn_sbm_id IS '미션 제출 아이디';
COMMENT ON COLUMN public.tb_msn_sbm_cm.usr_id IS '사용자 아이디';
COMMENT ON COLUMN public.tb_msn_sbm_cm.create_at IS '생성 일시';