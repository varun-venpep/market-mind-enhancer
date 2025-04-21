
export interface Store {
  id: string;
  store_url: string;
  access_token: string;
}

export interface Optimization {
  type: string;
  entity: string;
  field: string;
  original: string;
  suggestion: string;
  affected_urls?: string[];
}

export interface OptimizeResult {
  success: boolean;
  entityId: string | number;
  entityType: string;
  field: string;
  [key: string]: any;
}
