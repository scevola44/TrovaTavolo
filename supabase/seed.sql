-- Trova Tavolo — seed data
-- Cities: a starter set of major Italian comuni with approximate WGS84 coordinates.
-- Extend via additional seed migrations or by letting a future geocoder populate on demand.

-- ---------------------------------------------------------------------------
-- games
-- ---------------------------------------------------------------------------
insert into public.games (slug, name_it, name_en) values
  ('dnd-5e',          'Dungeons & Dragons 5e',       'Dungeons & Dragons 5e'),
  ('pathfinder-2e',   'Pathfinder 2a Edizione',      'Pathfinder 2nd Edition'),
  ('call-of-cthulhu', 'Il Richiamo di Cthulhu',      'Call of Cthulhu'),
  ('vampire-v5',      'Vampiri: la Masquerade V5',   'Vampire: the Masquerade V5'),
  ('warhammer-frp',   'Warhammer Fantasy Roleplay',  'Warhammer Fantasy Roleplay'),
  ('savage-worlds',   'Savage Worlds',               'Savage Worlds'),
  ('fate-core',       'Fate Core',                   'Fate Core'),
  ('dungeon-world',   'Dungeon World',               'Dungeon World'),
  ('cyberpunk-red',   'Cyberpunk RED',               'Cyberpunk RED'),
  ('brancalonia',     'Brancalonia',                 'Brancalonia'),
  ('sine-requie',     'Sine Requie',                 'Sine Requie'),
  ('altro',           'Altro sistema',               'Other system')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- cities — starter set of ~50 Italian cities
-- Coordinates from publicly available ISTAT / Wikipedia data, rounded to 4 decimals.
-- ---------------------------------------------------------------------------
insert into public.cities (name, region, location) values
  ('Roma',         'Lazio',                 st_setsrid(st_makepoint(12.4964, 41.9028), 4326)::geography),
  ('Milano',       'Lombardia',             st_setsrid(st_makepoint(9.1900,  45.4642), 4326)::geography),
  ('Napoli',       'Campania',              st_setsrid(st_makepoint(14.2681, 40.8518), 4326)::geography),
  ('Torino',       'Piemonte',              st_setsrid(st_makepoint(7.6869,  45.0703), 4326)::geography),
  ('Palermo',      'Sicilia',               st_setsrid(st_makepoint(13.3615, 38.1157), 4326)::geography),
  ('Genova',       'Liguria',               st_setsrid(st_makepoint(8.9463,  44.4056), 4326)::geography),
  ('Bologna',      'Emilia-Romagna',        st_setsrid(st_makepoint(11.3426, 44.4949), 4326)::geography),
  ('Firenze',      'Toscana',               st_setsrid(st_makepoint(11.2558, 43.7696), 4326)::geography),
  ('Bari',         'Puglia',                st_setsrid(st_makepoint(16.8719, 41.1171), 4326)::geography),
  ('Catania',      'Sicilia',               st_setsrid(st_makepoint(15.0873, 37.5079), 4326)::geography),
  ('Venezia',      'Veneto',                st_setsrid(st_makepoint(12.3155, 45.4408), 4326)::geography),
  ('Verona',       'Veneto',                st_setsrid(st_makepoint(10.9916, 45.4384), 4326)::geography),
  ('Padova',       'Veneto',                st_setsrid(st_makepoint(11.8767, 45.4064), 4326)::geography),
  ('Trieste',      'Friuli-Venezia Giulia', st_setsrid(st_makepoint(13.7768, 45.6495), 4326)::geography),
  ('Brescia',      'Lombardia',             st_setsrid(st_makepoint(10.2118, 45.5416), 4326)::geography),
  ('Bergamo',      'Lombardia',             st_setsrid(st_makepoint(9.6773,  45.6983), 4326)::geography),
  ('Parma',        'Emilia-Romagna',        st_setsrid(st_makepoint(10.3279, 44.8015), 4326)::geography),
  ('Modena',       'Emilia-Romagna',        st_setsrid(st_makepoint(10.9252, 44.6471), 4326)::geography),
  ('Reggio Emilia','Emilia-Romagna',        st_setsrid(st_makepoint(10.6307, 44.6983), 4326)::geography),
  ('Rimini',       'Emilia-Romagna',        st_setsrid(st_makepoint(12.5695, 44.0597), 4326)::geography),
  ('Ferrara',      'Emilia-Romagna',        st_setsrid(st_makepoint(11.6197, 44.8381), 4326)::geography),
  ('Ravenna',      'Emilia-Romagna',        st_setsrid(st_makepoint(12.2035, 44.4184), 4326)::geography),
  ('Forlì',        'Emilia-Romagna',        st_setsrid(st_makepoint(12.0408, 44.2226), 4326)::geography),
  ('Perugia',      'Umbria',                st_setsrid(st_makepoint(12.3889, 43.1107), 4326)::geography),
  ('Ancona',       'Marche',                st_setsrid(st_makepoint(13.5189, 43.6158), 4326)::geography),
  ('Pescara',      'Abruzzo',               st_setsrid(st_makepoint(14.2061, 42.4643), 4326)::geography),
  ('L''Aquila',    'Abruzzo',               st_setsrid(st_makepoint(13.3995, 42.3498), 4326)::geography),
  ('Campobasso',   'Molise',                st_setsrid(st_makepoint(14.6626, 41.5630), 4326)::geography),
  ('Potenza',      'Basilicata',            st_setsrid(st_makepoint(15.8056, 40.6424), 4326)::geography),
  ('Catanzaro',    'Calabria',              st_setsrid(st_makepoint(16.5956, 38.9098), 4326)::geography),
  ('Reggio Calabria','Calabria',            st_setsrid(st_makepoint(15.6446, 38.1113), 4326)::geography),
  ('Cosenza',      'Calabria',              st_setsrid(st_makepoint(16.2548, 39.2983), 4326)::geography),
  ('Lecce',        'Puglia',                st_setsrid(st_makepoint(18.1728, 40.3515), 4326)::geography),
  ('Taranto',      'Puglia',                st_setsrid(st_makepoint(17.2471, 40.4644), 4326)::geography),
  ('Foggia',       'Puglia',                st_setsrid(st_makepoint(15.5454, 41.4622), 4326)::geography),
  ('Salerno',      'Campania',              st_setsrid(st_makepoint(14.7681, 40.6824), 4326)::geography),
  ('Caserta',      'Campania',              st_setsrid(st_makepoint(14.3333, 41.0733), 4326)::geography),
  ('Messina',      'Sicilia',               st_setsrid(st_makepoint(15.5540, 38.1938), 4326)::geography),
  ('Siracusa',     'Sicilia',               st_setsrid(st_makepoint(15.2866, 37.0755), 4326)::geography),
  ('Cagliari',     'Sardegna',              st_setsrid(st_makepoint(9.1147,  39.2238), 4326)::geography),
  ('Sassari',      'Sardegna',              st_setsrid(st_makepoint(8.5585,  40.7259), 4326)::geography),
  ('Bolzano',      'Trentino-Alto Adige',   st_setsrid(st_makepoint(11.3548, 46.4983), 4326)::geography),
  ('Trento',       'Trentino-Alto Adige',   st_setsrid(st_makepoint(11.1217, 46.0748), 4326)::geography),
  ('Udine',        'Friuli-Venezia Giulia', st_setsrid(st_makepoint(13.2378, 46.0711), 4326)::geography),
  ('Pordenone',    'Friuli-Venezia Giulia', st_setsrid(st_makepoint(12.6598, 45.9564), 4326)::geography),
  ('Novara',       'Piemonte',              st_setsrid(st_makepoint(8.6221,  45.4469), 4326)::geography),
  ('Alessandria',  'Piemonte',              st_setsrid(st_makepoint(8.6116,  44.9133), 4326)::geography),
  ('La Spezia',    'Liguria',               st_setsrid(st_makepoint(9.8324,  44.1024), 4326)::geography),
  ('Pisa',         'Toscana',               st_setsrid(st_makepoint(10.4017, 43.7228), 4326)::geography),
  ('Livorno',      'Toscana',               st_setsrid(st_makepoint(10.3086, 43.5485), 4326)::geography),
  ('Siena',        'Toscana',               st_setsrid(st_makepoint(11.3307, 43.3188), 4326)::geography),
  ('Monza',        'Lombardia',             st_setsrid(st_makepoint(9.2744,  45.5845), 4326)::geography),
  ('Como',         'Lombardia',             st_setsrid(st_makepoint(9.0852,  45.8081), 4326)::geography),
  ('Varese',       'Lombardia',             st_setsrid(st_makepoint(8.8257,  45.8206), 4326)::geography),
  ('Vicenza',      'Veneto',                st_setsrid(st_makepoint(11.5416, 45.5455), 4326)::geography),
  ('Treviso',      'Veneto',                st_setsrid(st_makepoint(12.2430, 45.6669), 4326)::geography),
  ('Aosta',        'Valle d''Aosta',        st_setsrid(st_makepoint(7.3150,  45.7372), 4326)::geography)
on conflict (name, region) do nothing;
