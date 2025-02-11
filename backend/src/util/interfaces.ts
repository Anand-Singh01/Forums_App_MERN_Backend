export interface ITokenData {
    userId: string;
    email: string;
}

export interface IAddPostData {
    userId:string
    caption: string;
    location: string | null;
}

export interface ServiceResponse<T = unknown> {
    status: boolean;
    statusCode: 401 | 500 | 400 | 200 | 404;
    message: string | null;
    data: T | null;
}

export interface IUpdatePostData {
    postId:string,
    caption:string;
    location:string | null;
    isImageUpdated:boolean;
}

export interface ICreateComment {
    postId:string,
    comment:string,
}
  