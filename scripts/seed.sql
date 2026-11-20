-- Cartly — optional Neon Postgres schema for a production catalog/orders store.
-- The app ships with an in-process catalog and order store, so this is optional.

create extension if not exists pgcrypto;

create table if not exists products (
  slug text primary key,
  name text not null,
  category text not null,
  price_cents integer not null check (price_cents > 0),
  compare_at_cents integer,
  rating numeric(2, 1) not null default 0,
  reviews integer not null default 0,
  badge text,
  image text,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_email text not null,
  customer_name text not null,
  items jsonb not null,
  subtotal_cents integer not null,
  discount_cents integer not null default 0,
  shipping_cents integer not null default 0,
  total_cents integer not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_email_idx on orders (customer_email);
create index if not exists products_category_idx on products (category);
