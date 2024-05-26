-- public.article definition

-- Drop table

-- DROP TABLE public.article;

CREATE TABLE public.article (
	article_id uuid NOT NULL,
	curriculum_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	usr_id uuid NOT NULL,
	CONSTRAINT article_pkey PRIMARY KEY (article_id),
	CONSTRAINT article_curriculum_fk FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(curriculum_id),
	CONSTRAINT article_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);