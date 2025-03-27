export interface ITokenData {
  userId: string;
  email: string;
}

export interface IAddPostData {
  caption: string;
  region: string | null;
}

export interface ISavePostData {
  postId: string;
}

export interface ILikePostData {
  postId: string;
}

export interface ServiceResponse<T = unknown> {
  status: boolean;
  statusCode: 401 | 500 | 400 | 200 | 404;
  message: string | null;
  data: T | null;
}

export interface IMessageRequest {
  senderId: string;
  receiverId: string;
  message: string;
}

export interface IRegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  dob: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}
export interface IUpdatePostData {
  postId: string;
  caption: string;
  region: string | null;
  isImageUpdated: string;
}

export interface IUpdateProfileData {
  name: string;
  description: string;
  isImageUpdated: boolean;
}

export interface ICreateComment {
  postId: string;
  comment: string;
}

export interface ICreateReply {
  commentId: string;
  reply: string;
}

export interface IUpdateComment {
  commentId: string;
  comment: string;
}

export interface IUpdateReply {
  replyId: string;
  reply: string;
}

export interface ICommentDto {
  commentId: string;
  comment: string;
  isEdited: boolean;
  postId: string;
  commentedBy: {
    userId: string;
    userName: string;
    profilePicture: string;
  };
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationDto {
  conversationId: string;
  participants: [
    {
      userId: string;
      userName: string;
      profilePicture: string;
    }
  ];
  messages: [
    {
      messageId: string;
      content: string;
      isEdited: boolean;
      senderId: string;
      createdAt: Date;
    }
  ];
}

export interface IReplyDto {
  replyId: string;
  reply: string;
  isEdited: boolean;
  commentId: string;
  replyBy: {
    userId: string;
    userName: string;
    profilePicture: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDto {
  postId: string;
  caption: string;
  region: string | null;
  postImage: string;
  postedBy: {
    userId: string;
    userName: string;
    profileImage:string;
  };
  totalLikes: number;
  totalSave: number;
  totalComments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFollowerDto {
  userId: string;
  profilePicture: string;
  userName: string;
}


export interface ISearchUserData {
  userId: string;
  profilePicture: string | null;
  userName: string;
}

export interface IUserInfoDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  profileName: string;
  profilePicture: string;
  dob: Date;
}