-- public.learn_posting definition

-- Drop table

-- DROP TABLE public.learn_posting;

CREATE TABLE public.learn_posting (
	posting_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	usr_id uuid NOT NULL,
	CONSTRAINT learn_posting_pkey PRIMARY KEY (posting_id),
	CONSTRAINT learn_posting_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);