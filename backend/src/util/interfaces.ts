export interface ITokenData {
    userId: string;
    email: string;
}

export interface IPostData {
    caption: string;
    location: string | null;
}

export interface ServiceResponse<T = unknown> {
    status: boolean;
    statusCode: 401 | 500 | 400 | 200 | 404;
    message: string | null;
    data: T | null;
  }
  