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


export interface IRegisterUser{
 email: string;
    password: string;  
    firstName: string;
    lastName: string;
    userName: string;
    dob: Date; 
}

export interface ILoginUser{
    email: string;
    password: string;
}
export interface IUpdatePostData {
    postId:string,
    caption:string;
    location:string | null;
    isImageUpdated:boolean;
}

export interface IUpdateProfileData {
    name: string; 
    description: string; 
    isImageUpdated: boolean; 
  }
  
