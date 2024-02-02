ALTER TABLE public.content ADD COLUMN visible BOOLEAN;

UPDATE public."content" 
   SET visible = true;
  
ALTER TABLE public."content" ALTER COLUMN visible SET NOT NULL;
