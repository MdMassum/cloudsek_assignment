export interface IPaginationOptions {
    page: number;
    limit: number;
  }
  
  export interface IPaginationResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
  }