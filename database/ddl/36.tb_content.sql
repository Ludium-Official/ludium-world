-- public."content" definition

-- Drop table

-- DROP TABLE public."content";

CREATE TABLE public."content" (
	content_id uuid NOT NULL,
	title varchar(250) NOT NULL,
	description text NOT NULL,
	usr_id uuid NOT NULL,
	create_at timestamp NOT NULL,
	CONSTRAINT content_pkey PRIMARY KEY (content_id),
	CONSTRAINT content_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);