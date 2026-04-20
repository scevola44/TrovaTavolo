import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@trova-tavolo/core/schemas': fileURLToPath(
        new URL('../../packages/core/src/schemas/index.ts', import.meta.url),
      ),
      '@trova-tavolo/core/constants': fileURLToPath(
        new URL('../../packages/core/src/constants.ts', import.meta.url),
      ),
      '@trova-tavolo/core/supabase/server': fileURLToPath(
        new URL('../../packages/core/src/supabase/server.ts', import.meta.url),
      ),
      '@trova-tavolo/core/supabase/admin': fileURLToPath(
        new URL('../../packages/core/src/supabase/admin.ts', import.meta.url),
      ),
    },
  },
});
