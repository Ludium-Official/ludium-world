-- public.tb_apl_mdn_ref definition

-- Drop table

-- DROP TABLE public.tb_apl_mdn_ref;

CREATE TABLE public.tb_apl_mdn_ref (
	apl_id uuid NOT NULL, -- 지원서 아이디
	mdl_id uuid NOT NULL, -- 모듈 아이디
	CONSTRAINT tb_apl_mdn_pk PRIMARY KEY (apl_id),
	CONSTRAINT tb_apl_mdn_un UNIQUE (mdl_id),
	CONSTRAINT tb_apl_mdn_fk FOREIGN KEY (mdl_id) REFERENCES public.tb_art(id)
);
COMMENT ON TABLE public.tb_apl_mdn_ref IS '모듈 지원서 참고';

-- Column comments

COMMENT ON COLUMN public.tb_apl_mdn_ref.apl_id IS '지원서 아이디';
COMMENT ON COLUMN public.tb_apl_mdn_ref.mdl_id IS '모듈 아이디';