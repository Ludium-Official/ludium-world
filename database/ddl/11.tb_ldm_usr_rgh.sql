-- public.tb_ldm_usr_rgh definition

-- Drop table

-- DROP TABLE public.tb_ldm_usr_rgh;

CREATE TABLE public.tb_ldm_usr_rgh (
	id uuid NOT NULL, -- 아이디
	is_crt bool NOT NULL DEFAULT false, -- 컨트리뷰터 여부
	is_prv bool NOT NULL DEFAULT false, -- 프로바이더 여부
	is_adm bool NOT NULL DEFAULT false, -- 관리자 여부
	CONSTRAINT usr_rgh_pk PRIMARY KEY (id),
	CONSTRAINT usr_rgh_fk FOREIGN KEY (id) REFERENCES public.tb_ldm_usr(id)
);

-- Column comments

COMMENT ON COLUMN public.tb_ldm_usr_rgh.id IS '아이디';
COMMENT ON COLUMN public.tb_ldm_usr_rgh.is_crt IS '컨트리뷰터 여부';
COMMENT ON COLUMN public.tb_ldm_usr_rgh.is_prv IS '프로바이더 여부';
COMMENT ON COLUMN public.tb_ldm_usr_rgh.is_adm IS '관리자 여부';

INSERT INTO public.tb_ldm_usr_rgh (id, is_crt, is_prv, is_adm)
	SELECT id, true, false, false FROM tb_ldm_usr;