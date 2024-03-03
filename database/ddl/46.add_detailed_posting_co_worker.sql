-- public.detailed_posting_co_worker definition

-- Drop table

-- DROP TABLE public.detailed_posting_co_worker;

CREATE TABLE public.detailed_posting_co_worker (
	detail_id uuid NOT NULL,
	usr_id uuid NOT NULL,
	CONSTRAINT detailed_posting_co_worker_pk PRIMARY KEY (detail_id, usr_id),
	CONSTRAINT detailed_posting_co_worker_detailed_posting_fk FOREIGN KEY (detail_id) REFERENCES public.detailed_posting(detail_id),
	CONSTRAINT detailed_posting_co_worker_tb_ldm_usr_fk FOREIGN KEY (usr_id) REFERENCES public.tb_ldm_usr(id)
);