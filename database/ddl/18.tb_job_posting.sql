-- public.job_posting definition

-- Drop table

-- DROP TABLE public.job_posting;

CREATE TABLE public.job_posting (
	posting_id uuid NOT NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	deadline timestamp NULL,
	CONSTRAINT job_posting_pkey PRIMARY KEY (posting_id)
);

INSERT INTO job_posting (posting_id, title, description)
SELECT id, title, content
  FROM tb_art
 WHERE category = 'ANNOUNCEMENT'; 