CREATE TABLE public.coin_network (
    id uuid NOT NULL,
    coin_id uuid NOT NULL,
    network_id uuid NOT NULL,
    contract_address varchar(100),
    created_date timestamp NOT NULL DEFAULT now(),
    updated_date timestamp NOT NULL DEFAULT now(),
    CONSTRAINT coin_network_pk PRIMARY KEY (id),
    CONSTRAINT coin_network_fk_coin FOREIGN KEY (coin_id) REFERENCES public.coin (id),
    CONSTRAINT coin_network_fk_network FOREIGN KEY (network_id) REFERENCES public.network (id)
);