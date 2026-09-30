export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface IApiError {
  message: string;
  code: string;
  status: number;
}
