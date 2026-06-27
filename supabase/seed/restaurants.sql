-- Seed : 7 restaurants de démonstration + livreurs à Bamako
insert into profiles (id, phone, full_name, role) values
  ('00000000-0000-0000-0000-000000000001', '+22376000001', 'Admin SwiftMali', 'admin'),
  ('00000000-0000-0000-0000-000000000002', '+22376000002', 'La Terrasse', 'merchant'),
  ('00000000-0000-0000-0000-000000000003', '+22376000003', 'Maquis Djé', 'merchant'),
  ('00000000-0000-0000-0000-000000000004', '+22376000004', 'Fast Bamako', 'merchant'),
  ('00000000-0000-0000-0000-000000000005', '+22376000005', 'Saveur du Sahel', 'merchant'),
  ('00000000-0000-0000-0000-000000000006', '+22376000006', 'Supermarché Score', 'merchant'),
  ('00000000-0000-0000-0000-000000000007', '+22376000007', 'Boulangerie Tartine', 'merchant'),
  ('00000000-0000-0000-0000-000000000008', '+22376000008', 'Resto Hamdallaye', 'merchant'),
  ('00000000-0000-0000-0000-000000000010', '+22376000010', 'Moussa Traoré', 'driver'),
  ('00000000-0000-0000-0000-000000000011', '+22376000011', 'Aïssata Diallo', 'driver'),
  ('00000000-0000-0000-0000-000000000012', '+22376000012', 'Oumar Coulibaly', 'driver')
on conflict do nothing;

insert into restaurants (id, name, slug, description, category, tags, address, commune, lat, lng, rating, rating_count, delivery_time_min, delivery_time_max, min_order, delivery_fee, is_open, is_featured, owner_id) values
  ('a0000001-0000-0000-0000-000000000001','La Terrasse','la-terrasse','Cuisine malienne authentique, grillades et poulet yassa.','Malien','{"Populaire","Grillades","Yassa"}','Rue 48, ACI 2000','III',12.6500,-8.0000,4.8,342,25,40,2000,500,true,true,'00000000-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000002','Maquis Djé','maquis-dje','Attiéké, frite-poisson, brochettes.','Ivoirien','{"Attiéké","Poisson","Brochettes"}','Hippodrome, Commune II','II',12.6700,-8.0100,4.6,187,20,35,1500,500,true,false,'00000000-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000003','Fast Bamako','fast-bamako','Burgers artisanaux, wraps et sandwichs.','Fast-food','{"Burger","Wrap","Rapide"}','Hamdallaye, Commune IV','IV',12.6400,-8.0500,4.5,521,15,30,1500,500,true,true,'00000000-0000-0000-0000-000000000004'),
  ('a0000001-0000-0000-0000-000000000004','Saveur du Sahel','saveur-du-sahel','Tô, riz sauce, thiéboudiène.','Africain','{"Tô","Thiéboudiène","Familial"}','Badalabougou, Commune V','V',12.6200,-8.0000,4.7,278,30,50,1000,500,true,false,'00000000-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000005','Supermarché Score','score','Produits frais, boissons, épicerie.','Supermarché','{"Épicerie","Boissons","Frais"}','ACI 2000, Commune III','III',12.6490,-8.0010,4.4,155,20,40,3000,750,true,true,'00000000-0000-0000-0000-000000000006'),
  ('a0000001-0000-0000-0000-000000000006','Boulangerie Tartine','tartine','Pains chauds, viennoiseries, pâtisseries.','Boulangerie','{"Pain","Pâtisserie","Petit-déj"}','Magnambougou, Commune VI','VI',12.5900,-7.9500,4.9,412,15,25,500,500,true,true,'00000000-0000-0000-0000-000000000007'),
  ('a0000001-0000-0000-0000-000000000007','Resto Hamdallaye','resto-hamdallaye','Riz gras, poulet braisé, jus locaux.','Malien','{"Riz gras","Poulet","Jus"}','Hamdallaye ACI, Commune IV','IV',12.6410,-8.0510,4.3,94,25,45,1000,500,true,false,'00000000-0000-0000-0000-000000000008')
on conflict do nothing;

insert into drivers (profile_id, plate, moto_model, zone, is_online, lat, lng, rating, trip_count) values
  ('00000000-0000-0000-0000-000000000010','BKO 2845 MD','Yamaha Crux','III',true,12.6510,-8.0005,4.9,1284),
  ('00000000-0000-0000-0000-000000000011','BKO 4012 MC','TVS Star','IV',true,12.6395,-8.0498,4.8,932),
  ('00000000-0000-0000-0000-000000000012','BKO 1567 MA','Sanya 110','V',false,12.6205,-7.9998,5.0,2103)
on conflict do nothing;
