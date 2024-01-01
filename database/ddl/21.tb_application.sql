-- public.application definition

-- Drop table

-- DROP TABLE public.application;

CREATE TABLE public.application (
	application_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	detail_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	submission_date timestamp NULL,
	CONSTRAINT application_pkey PRIMARY KEY (application_id),
	CONSTRAINT application_un UNIQUE (detail_id, usr_id, role),
	CONSTRAINT application_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES public.detailed_posting(detail_id),
	CONSTRAINT application_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);

INSERT INTO application (application_id, title, description, detail_id, usr_id, role)
SELECT tasr.sbm_id, ta.title, ta.content, tamf.mdl_id, tasr.usr_id, 'PROVIDER'
  FROM tb_apl_sbm_ref tasr
 INNER JOIN tb_apl_mdn_ref tamf
    ON tasr.apl_id = tamf.apl_id
 INNER JOIN tb_art ta
    ON ta.id = tasr.sbm_id;