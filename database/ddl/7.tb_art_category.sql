ALTER TABLE public.tb_art ADD category varchar(20) NULL;
COMMENT ON COLUMN public.tb_art.category IS '범주';

update public.tb_art set category = 'MISSION';
ALTER TABLE public.tb_art ALTER COLUMN category SET NOT NULL;