ALTER TABLE public.job_posting ADD create_at timestamp;

WITH numbered_rows AS (
  SELECT
    posting_id,
    create_at,
    ROW_NUMBER() OVER (ORDER BY create_at) AS row_num
  FROM public.job_posting
)
UPDATE public.job_posting AS jp
SET create_at = now() + (row_num || ' seconds')::interval
FROM numbered_rows
WHERE jp.posting_id = numbered_rows.posting_id;
	
ALTER TABLE public.job_posting ALTER COLUMN create_at SET NOT NULL;
