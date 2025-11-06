export type MockSupabaseResponse = {
  data?: any;
  createdData?: any;
  error?: any;
  count?: number | null;
};

export function createMockSupabase(response: MockSupabaseResponse = {}) {
  const defaultResponse: MockSupabaseResponse = {
    data: [],
    createdData: null,
    error: null,
    count: null,
    ...response,
  };

  // Chainable builder that mirrors Supabase query builder methods
  const builder: any = {
    select: (..._args: any[]) => builder,
    eq: (..._args: any[]) => builder,
    gte: (..._args: any[]) => builder,
    lte: (..._args: any[]) => builder,
    order: (..._args: any[]) => builder,
    range: (_from: number, _to: number) => Promise.resolve(defaultResponse),
    single: () => Promise.resolve(defaultResponse),
  };

  const supabaseMock = {
    supabase: {
      from: (_table: string) => ({
        select: (..._args: any[]) => builder,
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: defaultResponse.createdData ?? defaultResponse.data?.[0], error: defaultResponse.error }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: defaultResponse.error }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve(defaultResponse),
            }),
          }),
        }),
      }),
    },
  };

  return supabaseMock;
}

export default createMockSupabase;
