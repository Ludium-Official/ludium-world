-- public.detailed_posting_content definition

-- Drop table

-- DROP TABLE public.detailed_posting_content;

CREATE TABLE public.detailed_posting_content (
	detail_content_id uuid NOT NULL,
	detail_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	usr_id uuid NOT NULL,
	create_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT detailed_posting_content_pkey PRIMARY KEY (detail_content_id),
	CONSTRAINT detailed_posting_content_detailed_posting_fk FOREIGN KEY (detail_id) REFERENCES public.detailed_posting(detail_id),
	CONSTRAINT detailed_posting_content_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);