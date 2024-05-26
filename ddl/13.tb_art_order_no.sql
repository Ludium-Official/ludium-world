ALTER TABLE public.tb_art ADD order_no int NOT NULL DEFAULT 0;
COMMENT ON COLUMN public.tb_art.order_no IS '정렬 번호';