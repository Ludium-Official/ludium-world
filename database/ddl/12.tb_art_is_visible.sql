ALTER TABLE public.tb_art ADD is_visible boolean NOT NULL DEFAULT true;
COMMENT ON COLUMN public.tb_art.is_visible IS '공개 여부';
