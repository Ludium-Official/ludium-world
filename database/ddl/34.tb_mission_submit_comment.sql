-- public.mission_submit_comment definition

-- Drop table

-- DROP TABLE public.mission_submit_comment;

CREATE TABLE public.mission_submit_comment (
	mission_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	commentor uuid NOT NULL,
	CONSTRAINT mission_submit_comment_pkey PRIMARY KEY (mission_id, usr_id, create_at),
	CONSTRAINT mission_submit_comment_commentor_fkey FOREIGN KEY (commentor) REFERENCES public.tb_ldm_usr(id),
	CONSTRAINT mission_submit_comment_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES public.mission(mission_id),
	CONSTRAINT mission_submit_comment_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);