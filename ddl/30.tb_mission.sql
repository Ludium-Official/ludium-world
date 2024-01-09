-- public.mission definition

-- Drop table

-- DROP TABLE public.mission;

CREATE TABLE public.mission (
	mission_id uuid NOT NULL,
	curriculum_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	usr_id uuid NOT NULL,
	mission_submit_form text NOT NULL,
	CONSTRAINT mission_pkey PRIMARY KEY (mission_id),
	CONSTRAINT mission_curriculum_fk FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(curriculum_id),
	CONSTRAINT mission_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);