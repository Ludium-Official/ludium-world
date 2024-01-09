-- public.curriculum definition

-- Drop table

-- DROP TABLE public.curriculum;

CREATE TABLE public.curriculum (
	curriculum_id uuid NOT NULL,
	posting_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	usr_id uuid NOT NULL,
	CONSTRAINT curriculum_pkey PRIMARY KEY (curriculum_id),
	CONSTRAINT curriculum_learn_posting_fk FOREIGN KEY (posting_id) REFERENCES public.learn_posting(posting_id),
	CONSTRAINT curriculum_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);