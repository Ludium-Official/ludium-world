ALTER TABLE public."content" ADD banner varchar(255) NULL;

UPDATE public."content"
   SET banner = '';

ALTER TABLE public."content" ALTER COLUMN banner SET NOT NULL;