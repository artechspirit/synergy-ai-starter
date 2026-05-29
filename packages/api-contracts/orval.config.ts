import { defineConfig } from 'orval';

export default defineConfig({
  synergy: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated',
      schemas: './src/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/fetcher.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
      biome: false,
      prettier: true,
    },
  },
});
