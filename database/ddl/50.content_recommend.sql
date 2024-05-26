drop table content_recommend;

create table content_recommend (
	content_id uuid not null,
	usr_id uuid not null,
	create_at timestamp not null,
	constraint content_recommend_pkey primary key(content_id, usr_id),
	constraint content_recommend_content_id_fk foreign key(content_id) references content(content_id),
	constraint content_recommend_usr_id_fk foreign key(usr_id) references tb_ldm_usr(id)
);