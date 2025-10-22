/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface ScanItem {
  id?: string;
  content: string;
  meta?: Record<string, any> | null;
  created_at?: string;
}

export interface ListScansResponse {
  items: ScanItem[];
}

export interface CreateScanResponse {
  saved: boolean;
  item: ScanItem;
  message?: string;
}

export interface KeycardItem {
  idx?: number | null;
  id: string;
  user_id?: string | null;
  unique_id: string;
  status?: string | null;
  qr_code_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  type?: string | null;
  expires_at?: string | null;
  is_vip?: boolean | null;
  [key: string]: any;
}

export interface KeycardLookupResponse {
  found: boolean;
  item?: KeycardItem;
  error?: string;
}
