-- public.tb_ggl_rfr_tk definition

-- Drop table

-- DROP TABLE public.tb_ggl_rfr_tk;

CREATE TABLE public.tb_ggl_rfr_tk (
	ggl_id numeric NOT NULL, -- 구글 아이디
	ggl_tk varchar NOT NULL, -- 구글 토큰
	CONSTRAINT tb_ggl_rfr_tk_pk PRIMARY KEY (ggl_id)
);
COMMENT ON TABLE public.tb_ggl_rfr_tk IS '구글 리프레시 토큰';

-- Column comments

COMMENT ON COLUMN public.tb_ggl_rfr_tk.ggl_id IS '구글 아이디';
COMMENT ON COLUMN public.tb_ggl_rfr_tk.ggl_tk IS '구글 토큰';

INSERT INTO tb_ggl_rfr_tk (ggl_id, ggl_tk)
	SELECT ggl_id, '' as ggl_tk FROM tb_ggl_auth_info;

ALTER TABLE public.tb_ggl_auth_info ADD CONSTRAINT tb_ggl_auth_info_fk FOREIGN KEY (ggl_id) REFERENCES public.tb_ggl_rfr_tk(ggl_id);
