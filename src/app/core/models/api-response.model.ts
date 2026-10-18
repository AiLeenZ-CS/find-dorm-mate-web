export interface ApiResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: ApiResponseMeta;
}
