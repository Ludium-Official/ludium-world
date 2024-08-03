ALTER TABLE public.coin ADD decimals int4 NULL;
UPDATE public.coin SET decimals = 0;
ALTER TABLE public.coin ALTER COLUMN decimals SET NOT NULL;