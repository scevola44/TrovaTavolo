export const ANNOUNCEMENT_KINDS = ['looking_for_players', 'looking_for_gm', 'looking_for_group'] as const;
export type AnnouncementKind = (typeof ANNOUNCEMENT_KINDS)[number];

export const DEFAULT_ANNOUNCEMENT_LIFETIME_DAYS = 60;
export const MAX_ANNOUNCEMENTS_PER_USER_PER_DAY = 3;

export const ANNOUNCEMENT_TITLE_MIN = 4;
export const ANNOUNCEMENT_TITLE_MAX = 120;
export const ANNOUNCEMENT_BODY_MIN = 20;
export const ANNOUNCEMENT_BODY_MAX = 4000;

export const PROFILE_DISPLAY_NAME_MIN = 2;
export const PROFILE_DISPLAY_NAME_MAX = 40;
export const PROFILE_BIO_MAX = 500;
export const PROFILE_CONTACT_HANDLE_MIN = 3;
export const PROFILE_CONTACT_HANDLE_MAX = 120;

export const BACHECA_PAGE_SIZE = 20;
export const CITY_TYPEAHEAD_LIMIT = 10;
