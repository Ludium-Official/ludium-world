-- public.tb_art definition

-- Drop table

-- DROP TABLE public.tb_art;

CREATE TABLE public.tb_art (
	id uuid NOT NULL, -- 아이디
	title varchar(50) NOT NULL, -- 제목
	"content" text NOT NULL, -- 본문
	usr_id uuid NOT NULL, -- 사용자 아이디
	CONSTRAINT tb_art_pk PRIMARY KEY (id),
	CONSTRAINT tb_art_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);
COMMENT ON TABLE public.tb_art IS '아티클';

-- Column comments

COMMENT ON COLUMN public.tb_art.id IS '아이디';
COMMENT ON COLUMN public.tb_art.title IS '제목';
COMMENT ON COLUMN public.tb_art."content" IS '본문';
COMMENT ON COLUMN public.tb_art.usr_id IS '사용자 아이디';