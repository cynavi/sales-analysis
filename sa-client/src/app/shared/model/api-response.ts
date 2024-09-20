export type ApiResponse<T> = {
  data?: T;
  errors?: {
    id: number;
    title: string[];
    detail: string[];
  }
}
