export type Artwork = {
  id: number;
  title: string;
  artist_title?: string | null;
  date_display?: string | null;
  medium_display?: string | null;
  department_title?: string | null;
  image_id?: string | null;
};

export type SearchResponse = {
  data: Artwork[];
  pagination: { total: number; current_page: number; limit: number };
};
