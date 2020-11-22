create table if not exists products (
	id uuid PRIMARY key default uuid_generate_v4(),
    title text NOT null,
    description text,
    price decimal,
    image text
);

create table stocks (
	id serial primary key,
	product_id uuid UNIQUE,
	count  integer
);

alter table stocks
	add constraint fk_products_id
	foreign key (product_id)
	references products(id)
	on delete cascade;
