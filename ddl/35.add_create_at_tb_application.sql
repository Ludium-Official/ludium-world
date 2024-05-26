ALTER TABLE application ADD create_at timestamp NULL;

WITH numbered_rows AS (
  SELECT
    application_id,
    create_at,
    ROW_NUMBER() OVER (ORDER BY create_at) AS row_num
  FROM public.application
)
UPDATE public.application AS ap
SET create_at = now() + (row_num || ' seconds')::interval
FROM numbered_rows
WHERE ap.application_id = numbered_rows.application_id;

ALTER TABLE public.application ALTER COLUMN create_at SET NOT NULL;