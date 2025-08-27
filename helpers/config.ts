export interface TestConfig {
  searchTerm: string;
}

export function getTestConfig(): TestConfig {
  return {
    searchTerm: process.env.SEARCH_TERM || 'lego',
  };
}

export const config = getTestConfig();