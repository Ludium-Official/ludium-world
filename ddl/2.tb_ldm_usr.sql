-- public.tb_ldm_usr definition

-- Drop table

-- DROP TABLE public.tb_ldm_usr;

CREATE TABLE public.tb_ldm_usr (
	id uuid NOT NULL, -- 아이디
	nick varchar(30) NOT NULL DEFAULT ''::character varying, -- 닉네임
	self_intro varchar(100) NOT NULL DEFAULT ''::character varying, -- 자기소개
	ggl_id numeric NOT NULL, -- 구글 아이디
	phn_nmb varchar NOT NULL, -- 전화번호
	CONSTRAINT tb_ldm_usr_pk PRIMARY KEY (id),
	CONSTRAINT tb_ldm_usr_un UNIQUE (ggl_id),
	CONSTRAINT tb_ldm_usr_fk FOREIGN KEY (ggl_id) REFERENCES public.tb_ggl_auth_info(ggl_id)
);
COMMENT ON TABLE public.tb_ldm_usr IS '루디움 사용자';

-- Column comments

COMMENT ON COLUMN public.tb_ldm_usr.id IS '아이디';
COMMENT ON COLUMN public.tb_ldm_usr.nick IS '닉네임';
COMMENT ON COLUMN public.tb_ldm_usr.self_intro IS '자기소개';
COMMENT ON COLUMN public.tb_ldm_usr.ggl_id IS '구글 아이디';
COMMENT ON COLUMN public.tb_ldm_usr.phn_nmb IS '전화번호';