-- public.tb_mdl definition

-- Drop table

-- DROP TABLE public.tb_mdl;

CREATE TABLE public.tb_mdl (
	id uuid NOT NULL, -- 아이디
	title varchar(50) NOT NULL, -- 제목
	"content" text NOT NULL, -- 본문
	category varchar(20) NOT NULL, -- 범주
	crs_id uuid NOT NULL, -- 수업 아이디
	CONSTRAINT tb_mdl_pk PRIMARY KEY (id),
	CONSTRAINT tb_mdl_fk FOREIGN KEY (crs_id) REFERENCES public.tb_art(id)
);
COMMENT ON TABLE public.tb_mdl IS '모듈';

-- Column comments

COMMENT ON COLUMN public.tb_mdl.id IS '아이디';
COMMENT ON COLUMN public.tb_mdl.title IS '제목';
COMMENT ON COLUMN public.tb_mdl."content" IS '본문';
COMMENT ON COLUMN public.tb_mdl.category IS '범주';
COMMENT ON COLUMN public.tb_mdl.crs_id IS '수업 아이디';