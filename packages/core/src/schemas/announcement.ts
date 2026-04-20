import { z } from 'zod';
import {
  ANNOUNCEMENT_BODY_MAX,
  ANNOUNCEMENT_BODY_MIN,
  ANNOUNCEMENT_KINDS,
  ANNOUNCEMENT_TITLE_MAX,
  ANNOUNCEMENT_TITLE_MIN,
} from '../constants';

export const announcementKindSchema = z.enum(ANNOUNCEMENT_KINDS);

export const createAnnouncementSchema = z.object({
  kind: announcementKindSchema,
  title: z.string().trim().min(ANNOUNCEMENT_TITLE_MIN).max(ANNOUNCEMENT_TITLE_MAX),
  body: z.string().trim().min(ANNOUNCEMENT_BODY_MIN).max(ANNOUNCEMENT_BODY_MAX),
  city_id: z.coerce.number().int().positive(),
  game_ids: z.array(z.coerce.number().int().positive()).min(1).max(10),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export const bachecaFilterSchema = z.object({
  kind: announcementKindSchema.optional(),
  city_id: z.coerce.number().int().positive().optional(),
  game_id: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type BachecaFilter = z.infer<typeof bachecaFilterSchema>;
