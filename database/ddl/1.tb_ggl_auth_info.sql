-- public.tb_ggl_auth_info definition

-- Drop table

-- DROP TABLE public.tb_ggl_auth_info;

CREATE TABLE public.tb_ggl_auth_info (
	ggl_id numeric NOT NULL, -- 구글 아이디
	ggl_gvn varchar(30) NOT NULL DEFAULT ''::character varying, -- 구글 성씨
	ggl_nm varchar(30) NOT NULL DEFAULT ''::character varying, -- 구글 이름
	ggl_eml varchar(30) NOT NULL, -- 구글 이메일
	CONSTRAINT tb_ggl_auth_info_pk PRIMARY KEY (ggl_id),
	CONSTRAINT tb_ggl_auth_info_un UNIQUE (ggl_eml)
);
COMMENT ON TABLE public.tb_ggl_auth_info IS '구글 인증 정보';

-- Column comments

COMMENT ON COLUMN public.tb_ggl_auth_info.ggl_id IS '구글 아이디';
COMMENT ON COLUMN public.tb_ggl_auth_info.ggl_gvn IS '구글 성씨';
COMMENT ON COLUMN public.tb_ggl_auth_info.ggl_nm IS '구글 이름';
COMMENT ON COLUMN public.tb_ggl_auth_info.ggl_eml IS '구글 이메일';