export type Status = "published" | "draft" | "archived";
export interface Category { id: string; name: string; slug: string }
export interface ProductType { id: string; name: string; slug: string }
export interface Tag { id: string; name: string; slug: string }
export interface Image { id: string; person_id: string; path: string; alt: string | null; position: number; is_cover: boolean; public_url?: string }
export interface AssetFile { id: string; person_id: string; name: string; path: string; mime_type: string; size: number; created_at: string; public_url?: string }
export interface Person { id: string; name: string; slug: string; description: string | null; status: Status; category_id: string | null; product_type_id: string | null; created_at: string; updated_at: string; category?: Category | null; product_type?: ProductType | null; images?: Image[]; files?: AssetFile[]; tags?: Tag[] }
