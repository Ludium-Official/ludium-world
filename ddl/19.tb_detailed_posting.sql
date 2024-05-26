-- public.detailed_posting definition

-- Drop table

-- DROP TABLE public.detailed_posting;

CREATE TABLE public.detailed_posting (
	detail_id uuid NOT NULL,
	posting_id uuid NULL,
	title varchar(255) NOT NULL,
	description text NOT NULL,
	deadline timestamp NULL,
	CONSTRAINT detailed_posting_pkey PRIMARY KEY (detail_id),
	CONSTRAINT detailed_posting_posting_id_fkey FOREIGN KEY (posting_id) REFERENCES public.job_posting(posting_id)
);

INSERT INTO detailed_posting(detail_id, title, description, posting_id)
SELECT ta.id, ta.title, ta.content, tm.crs_id
  FROM tb_art ta
 INNER JOIN tb_mdl tm
    ON ta.id = tm.id
 WHERE ta.category = 'MODULE';