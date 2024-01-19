-- public.content_comment definition

-- Drop table

-- DROP TABLE public.content_comment;

CREATE TABLE public.content_comment (
	content_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	CONSTRAINT content_comment_pkey PRIMARY KEY (content_id, usr_id, create_at),
	CONSTRAINT content_comment_content_id_fkey FOREIGN KEY (content_id) REFERENCES public."content"(content_id),
	CONSTRAINT content_comment_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);