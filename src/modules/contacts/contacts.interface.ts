export interface IQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  favorite?: string;
  search?: string;
}

export interface IContact {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isFavorite?: boolean;
  personalNote?: string;
}
