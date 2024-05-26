-- public.tb_mdl_ref definition

-- Drop table

-- DROP TABLE public.tb_mdl_ref;

CREATE TABLE public.tb_mdl_ref (
	mdl_id uuid NOT NULL, -- 모듈 아이디
	art_id uuid NOT NULL, -- 아티클 아이디
	CONSTRAINT tb_mdl_ref_pk PRIMARY KEY (mdl_id, art_id),
	CONSTRAINT tb_mdl_ref_fk FOREIGN KEY (mdl_id) REFERENCES public.tb_mdl(id),
	CONSTRAINT tb_mdl_ref_fk_1 FOREIGN KEY (art_id) REFERENCES public.tb_art(id)
);
COMMENT ON TABLE public.tb_mdl_ref IS '모듈 참고';

-- Column comments

COMMENT ON COLUMN public.tb_mdl_ref.mdl_id IS '모듈 아이디';
COMMENT ON COLUMN public.tb_mdl_ref.art_id IS '아티클 아이디';