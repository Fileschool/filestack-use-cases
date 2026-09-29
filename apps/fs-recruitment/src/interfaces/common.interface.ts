export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
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
