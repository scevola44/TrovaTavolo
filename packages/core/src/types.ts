import type { AnnouncementKind } from './constants';

export type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  contact_handle: string | null;
  created_at: string;
};

export type Game = {
  id: number;
  slug: string;
  name_it: string;
  name_en: string;
  is_active: boolean;
};

export type City = {
  id: number;
  name: string;
  region: string;
};

export type Announcement = {
  id: string;
  author_id: string;
  kind: AnnouncementKind;
  title: string;
  body: string;
  city_id: number;
  created_at: string;
  expires_at: string;
  is_active: boolean;
};

export type AnnouncementWithRelations = Announcement & {
  city: Pick<City, 'id' | 'name' | 'region'>;
  author: Pick<Profile, 'id' | 'display_name'>;
  games: Array<Pick<Game, 'id' | 'slug' | 'name_it'>>;
};
