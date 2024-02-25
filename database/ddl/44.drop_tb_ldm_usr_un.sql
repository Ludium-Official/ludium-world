INSERT INTO public.tb_ggl_rfr_tk
(ggl_id, ggl_tk)
VALUES(-1, '');

INSERT INTO public.tb_ggl_auth_info
(ggl_id, ggl_gvn, ggl_nm, ggl_eml)
VALUES(-1, ''::character varying, ''::character varying, '');

ALTER TABLE public.tb_ldm_usr DROP CONSTRAINT tb_ldm_usr_un;
