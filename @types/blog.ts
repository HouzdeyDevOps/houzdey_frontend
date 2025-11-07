export enum BlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum BlogCategory {
  BUYING_GUIDE = "Buying Guide",
  RENTING_GUIDE = "Renting Guide",
  LOCATION_GUIDE = "Location Guide",
  MARKET_INSIGHTS = "Market Insights",
  TIPS_ADVICE = "Tips & Advice",
  NEWS = "News",
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name?: string;
  author_email?: string;
  author_avatar?: string;
  category: BlogCategory;
  tags: string[];
  featured_image: string;
  featured_image_alt?: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  status: BlogStatus;
  published_at?: string;
  views: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCreate {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  featured_image: string;
  featured_image_alt?: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  status: BlogStatus;
}

export interface BlogUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: BlogCategory;
  tags?: string[];
  featured_image?: string;
  featured_image_alt?: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  status?: BlogStatus;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: BlogCategory;
  tag?: string;
  status?: BlogStatus;
}

export interface BlogResponse {
  blogs: Blog[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    page_size: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CategoryWithCount {
  category: string;
  count: number;
}
