-- public.mission_submit definition

-- Drop table

-- DROP TABLE public.mission_submit;

CREATE TABLE public.mission_submit (
	mission_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	description text NOT NULL,
	status varchar(50) NOT NULL,
	create_at timestamp NOT NULL,
	CONSTRAINT mission_submit_pkey PRIMARY KEY (mission_id, usr_id),
	CONSTRAINT mission_submit_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES public.mission(mission_id),
	CONSTRAINT mission_submit_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);