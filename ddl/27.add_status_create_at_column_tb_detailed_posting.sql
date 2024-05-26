ALTER TABLE public.detailed_posting ADD status varchar(50) NULL;

UPDATE detailed_posting
   SET status = 'CREATE';
	
ALTER TABLE public.detailed_posting ALTER COLUMN status SET NOT NULL;

ALTER TABLE public.detailed_posting ADD create_at timestamp NULL;

WITH numbered_rows AS (
  SELECT
    detail_id,
    posting_id,
    title,
    description,
    deadline,
    status,
    create_at,
    ROW_NUMBER() OVER (ORDER BY create_at) AS row_num
  FROM public.detailed_posting
)
UPDATE public.detailed_posting AS dp
SET create_at = now() + (row_num || ' seconds')::interval
FROM numbered_rows
WHERE dp.detail_id = numbered_rows.detail_id;

ALTER TABLE public.detailed_posting ALTER COLUMN create_at SET NOT NULL;
