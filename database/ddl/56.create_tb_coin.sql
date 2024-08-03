CREATE TABLE public.coin (
    id uuid NOT NULL,
    name varchar(50) NOT NULL,
    symbol varchar(10) NOT NULL,
    coin_type coin_type NOT NULL,
    created_date timestamp NOT NULL DEFAULT now(),
    updated_date timestamp NOT NULL DEFAULT now(),
    CONSTRAINT coin_pk PRIMARY KEY (id)
);