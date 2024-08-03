CREATE TABLE public.network (
    id uuid NOT NULL,
    name varchar(50) NOT NULL,
    code varchar(20) NOT NULL,
    created_date timestamp NOT NULL DEFAULT now(),
    updated_date timestamp NOT NULL DEFAULT now(),
    CONSTRAINT network_pk PRIMARY KEY (id)
);