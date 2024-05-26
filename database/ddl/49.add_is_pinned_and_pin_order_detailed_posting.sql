alter table detailed_posting add column is_pinned boolean not null default false;
alter table detailed_posting add column pin_order int not null default -1;