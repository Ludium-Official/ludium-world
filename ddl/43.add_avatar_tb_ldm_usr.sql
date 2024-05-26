ALTER TABLE public.tb_ldm_usr ADD avatar varchar(255) NULL;
COMMENT ON COLUMN public.tb_ldm_usr.avatar IS '아바타';

update public.tb_ldm_usr 
   set avatar = '/icon_default_profile.png';
   
ALTER TABLE public.tb_ldm_usr ALTER COLUMN avatar SET NOT NULL;
