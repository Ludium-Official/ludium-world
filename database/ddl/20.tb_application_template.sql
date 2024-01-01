-- public.application_template definition

-- Drop table

-- DROP TABLE public.application_template;

CREATE TABLE public.application_template (
	application_template_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	detail_id uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	create_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT application_template_pkey PRIMARY KEY (application_template_id),
	CONSTRAINT application_template_un UNIQUE (detail_id, role),
	CONSTRAINT application_template_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES public.detailed_posting(detail_id)
);

INSERT INTO application_template(application_template_id, title, description, detail_id, role)
SELECT tamr.apl_id, ta.title, ta.content, mdl_id, 'PROVIDER'
  FROM tb_apl_mdn_ref tamr
 INNER JOIN tb_art ta
    ON tamr.apl_id = ta.id;