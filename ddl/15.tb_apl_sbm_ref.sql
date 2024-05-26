-- public.tb_apl_sbm_ref definition

-- Drop table

-- DROP TABLE public.tb_apl_sbm_ref;

CREATE TABLE public.tb_apl_sbm_ref (
	apl_id uuid NOT NULL, -- 지원서 아이디
	sbm_id uuid NOT NULL, -- 제출 아이디
	usr_id uuid NOT NULL, -- 사용자 아이디
	CONSTRAINT tb_apl_sbm_ref_pk PRIMARY KEY (apl_id, usr_id),
	CONSTRAINT tb_apl_sbm_ref_fk FOREIGN KEY (sbm_id) REFERENCES public.tb_art(id),
	CONSTRAINT tb_apl_sbm_ref_fk2 FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);
COMMENT ON TABLE public.tb_apl_sbm_ref IS '지원서 제출 참고';

-- Column comments

COMMENT ON COLUMN public.tb_apl_sbm_ref.apl_id IS '지원서 아이디';
COMMENT ON COLUMN public.tb_apl_sbm_ref.sbm_id IS '제출 아이디';
COMMENT ON COLUMN public.tb_apl_sbm_ref.usr_id IS '사용자 아이디';