-- public.tb_msn_sbm definition

-- Drop table

-- DROP TABLE public.tb_msn_sbm;

CREATE TABLE public.tb_msn_sbm (
	id uuid NOT NULL, -- 아이디
	"content" text NOT NULL DEFAULT ''::text, -- 내용
	usr_id uuid NOT NULL, -- 사용자 아이디
	msn_id uuid NOT NULL, -- 미션 아이디
	vld_stt bool NOT NULL DEFAULT false, -- 검증 상태
	CONSTRAINT tb_msn_sbm_pk PRIMARY KEY (id),
	CONSTRAINT tb_msn_sbm_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id),
	CONSTRAINT tb_msn_sbm_fk_1 FOREIGN KEY (msn_id) REFERENCES public.tb_art(id)
);
COMMENT ON TABLE public.tb_msn_sbm IS '미션 제출';

-- Column comments

COMMENT ON COLUMN public.tb_msn_sbm.id IS '아이디';
COMMENT ON COLUMN public.tb_msn_sbm."content" IS '내용';
COMMENT ON COLUMN public.tb_msn_sbm.usr_id IS '사용자 아이디';
COMMENT ON COLUMN public.tb_msn_sbm.msn_id IS '미션 아이디';
COMMENT ON COLUMN public.tb_msn_sbm.vld_stt IS '검증 상태';