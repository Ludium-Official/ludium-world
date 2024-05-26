-- public.detailed_posting_content_comment definition

-- Drop table

-- DROP TABLE public.detailed_posting_content_comment;

CREATE TABLE public.detailed_posting_content_comment (
	detailed_content_comment_id uuid NOT NULL,
	detailed_content_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	description text NOT NULL,
	create_at timestamp NOT NULL,
	CONSTRAINT detailed_posting_content_comment_pkey PRIMARY KEY (detailed_content_comment_id),
	CONSTRAINT detailed_posting_content_comment_detailed_posting_content_fk FOREIGN KEY (detailed_content_id) REFERENCES public.detailed_posting_content(detail_content_id),
	CONSTRAINT detailed_posting_content_comment_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);