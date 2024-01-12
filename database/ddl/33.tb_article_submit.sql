-- public.article_submit definition

-- Drop table

-- DROP TABLE public.article_submit;

CREATE TABLE public.article_submit (
	article_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	status varchar(50) NOT NULL,
	create_at timestamp NOT NULL,
	CONSTRAINT article_submit_pkey PRIMARY KEY (article_id, usr_id),
	CONSTRAINT article_submit_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.article(article_id),
	CONSTRAINT article_submit_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);