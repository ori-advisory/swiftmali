-- SwiftMali — Migration 001 : schéma SwiftEats
create extension if not exists "uuid-ossp";

create type user_role as enum ('customer', 'driver', 'merchant', 'admin');
create type order_status as enum ('pending','confirmed','preparing','ready','picking_up','delivering','delivered','cancelled');
create type payment_method as enum ('orange_money', 'wave', 'cash');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table profiles (
  id         uuid primary key references auth.users on delete cascade,
  phone      text not null unique,
  full_name  text,
  avatar_url text,
  commune    text,
  role       user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Profil public" on profiles for select using (true);
create policy "Propre profil" on profiles for update using (auth.uid() = id);

create table restaurants (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  description       text,
  image_url         text,
  cover_url         text,
  category          text not null,
  tags              text[] not null default '{}',
  address           text not null,
  commune           text not null,
  lat               double precision not null,
  lng               double precision not null,
  phone             text,
  rating            numeric(3,2) not null default 0,
  rating_count      integer not null default 0,
  delivery_time_min integer not null default 20,
  delivery_time_max integer not null default 40,
  min_order         integer not null default 1000,
  delivery_fee      integer not null default 500,
  is_open           boolean not null default true,
  is_featured       boolean not null default false,
  owner_id          uuid references profiles(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table restaurants enable row level security;
create policy "Restaurants publics" on restaurants for select using (true);
create policy "Merchant propre resto" on restaurants for update using (auth.uid() = owner_id);
create index restaurants_commune_idx on restaurants(commune);
create index restaurants_category_idx on restaurants(category);

create table menu_categories (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  position      integer not null default 0
);
alter table menu_categories enable row level security;
create policy "Catégories publiques" on menu_categories for select using (true);

create table menu_items (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id   uuid references menu_categories(id) on delete set null,
  name          text not null,
  description   text,
  image_url     text,
  price         integer not null,
  is_available  boolean not null default true,
  is_popular    boolean not null default false,
  tags          text[] not null default '{}',
  position      integer not null default 0,
  created_at    timestamptz not null default now()
);
alter table menu_items enable row level security;
create policy "Plats publics" on menu_items for select using (true);
create index menu_items_restaurant_idx on menu_items(restaurant_id);

create table drivers (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid not null unique references profiles(id),
  plate       text not null,
  moto_model  text not null,
  zone        text not null,
  is_online   boolean not null default false,
  lat         double precision,
  lng         double precision,
  rating      numeric(3,2) not null default 5.0,
  trip_count  integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table drivers enable row level security;
create policy "Livreurs publics" on drivers for select using (true);
create policy "Livreur propre" on drivers for update using (auth.uid() = profile_id);

create table orders (
  id                    uuid primary key default uuid_generate_v4(),
  order_number          text not null unique,
  customer_id           uuid not null references profiles(id),
  restaurant_id         uuid not null references restaurants(id),
  driver_id             uuid references drivers(id),
  status                order_status not null default 'pending',
  subtotal              integer not null,
  delivery_fee          integer not null,
  total                 integer not null,
  payment_method        payment_method not null,
  payment_status        payment_status not null default 'pending',
  delivery_address      text not null,
  delivery_commune      text not null,
  delivery_lat          double precision,
  delivery_lng          double precision,
  notes                 text,
  estimated_delivery_at timestamptz,
  delivered_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
alter table orders enable row level security;
create policy "Client ses commandes" on orders for select using (auth.uid() = customer_id);
create policy "Client crée" on orders for insert with check (auth.uid() = customer_id);
create policy "Mise à jour" on orders for update using (auth.uid() = customer_id);
create index orders_customer_idx on orders(customer_id);
create index orders_status_idx on orders(status);

create table order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references orders(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id),
  name         text not null,
  price        integer not null,
  quantity     integer not null check (quantity > 0),
  notes        text
);
alter table order_items enable row level security;
create policy "Items via commande" on order_items for select using (
  exists (select 1 from orders where id = order_id and customer_id = auth.uid())
);

create table ratings (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null unique references orders(id),
  customer_id   uuid not null references profiles(id),
  driver_id     uuid references drivers(id),
  restaurant_id uuid references restaurants(id),
  score         integer not null check (score between 1 and 5),
  comment       text,
  tip           integer not null default 0,
  created_at    timestamptz not null default now()
);
alter table ratings enable row level security;
create policy "Avis publics" on ratings for select using (true);
create policy "Client soumet" on ratings for insert with check (auth.uid() = customer_id);

create or replace function generate_order_number() returns trigger as $$
begin
  new.order_number := 'SW-' || to_char(now(), 'YYMM') || '-' || lpad(floor(random()*99999+1)::text,5,'0');
  return new;
end;
$$ language plpgsql;
create trigger set_order_number before insert on orders for each row execute function generate_order_number();

create or replace function update_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger restaurants_updated_at before update on restaurants for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders for each row execute function update_updated_at();

create or replace function update_restaurant_rating() returns trigger as $$
begin
  update restaurants set
    rating = (select avg(score)::numeric(3,2) from ratings where restaurant_id = new.restaurant_id),
    rating_count = (select count(*) from ratings where restaurant_id = new.restaurant_id)
  where id = new.restaurant_id;
  return new;
end;
$$ language plpgsql;
create trigger after_rating_insert after insert on ratings for each row execute function update_restaurant_rating();
