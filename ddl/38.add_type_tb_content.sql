ALTER TABLE public."content" ADD type varchar(50);

UPDATE public.content SET
	type = 'CONTENT';
	
ALTER TABLE public."content" ALTER COLUMN "type" SET NOT NULL;
