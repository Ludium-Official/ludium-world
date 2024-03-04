alter table content add column is_pinned boolean not null default false;
alter table content add column pin_order int not null default -1;