import mongoose from "mongoose";
import * as postDtoLayer from "../domain/dto/postDto"; // Ensure this path is correct
import { IPost } from "../domain/models/post";
import { IProfile } from "../domain/models/profile";
import { IUser } from "../domain/models/user";
import * as postQueryLayer from "../domain/queries/post";
import * as populateLayer from "../infrastructure/database/mongo/populate";
import { addPost, deletePost, getAllPosts, getMyPosts, getPostById, updatePost } from "../infrastructure/repositories/postRepository";
import { IPostDto, IUpdatePostData } from "../util/interfaces";

// Mock functions
jest.mock("../domain/queries/post");
jest.mock("../infrastructure/database/mongo/populate");

describe("addPost Service", () => {
  // Define reusable mock data
  const userId = new mongoose.Types.ObjectId().toString();
  const mockPostData = {
    caption: "New Post Caption",
    region: "USA",
  };
  const mockImageUrl = "https://somecloudstorage.com/image.jpg";

  // Create a mock Mongoose Document that matches the IPost schema
  const mockSavedPost = {
    _id: new mongoose.Types.ObjectId(),
    ...mockPostData,
    postImage: mockImageUrl,
    postedBy: {
      _id: new mongoose.Types.ObjectId(),
      userName: "anand",
      profile: {
        _id: new mongoose.Types.ObjectId(),
        profilePicture: "https://somecloudstorage.com/profile.jpg", // Ensure this is included
      } as IProfile,
    } as IUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    save: jest.fn(),
    $isNew: false,
    $isDeleted: false,
    $__: {},
    $errors: null,
    $locals: {},
    $op: null,
    $where: {},
    $originalSave: jest.fn(),
    $__validate: jest.fn(),
    $__remove: jest.fn(),
    $__save: jest.fn(),
    $__validateSync: jest.fn(),
    $init: jest.fn(),
    $markValid: jest.fn(),
    $toObject: jest.fn().mockReturnValue({
      _id: new mongoose.Types.ObjectId(),
      ...mockPostData,
      postImage: mockImageUrl,
      postedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    }),
  } as unknown as mongoose.Document<unknown, {}, IPost> &
    IPost & { _id: mongoose.Types.ObjectId; __v: number };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should create a post and return a success response when image is provided", async () => {
    // Mock the post image upload function to return a dummy URL
    jest
      .spyOn(postQueryLayer, "saveImageOnCloud")
      .mockResolvedValue(mockImageUrl);

    // Mock addPostQuery to return a mock saved post
    jest.spyOn(postQueryLayer, "addPostQuery").mockResolvedValue(mockSavedPost);

    // Mock populatePost to return a mock saved post
    jest.spyOn(populateLayer, "populatePost").mockResolvedValue(mockSavedPost);

    // Mock the DTO conversion function
    const mockPostDto: IPostDto = {
      postId: mockSavedPost._id.toString(),
      caption: mockSavedPost.caption,
      region: mockSavedPost.region,
      postImage: mockSavedPost.postImage,
      postedBy: {
        userId: (mockSavedPost.postedBy as IUser)._id.toString(),
        profileImage: ((mockSavedPost.postedBy as IUser).profile as IProfile)
          .profilePicture,
        userName: (mockSavedPost.postedBy as IUser).userName,
      },
      createdAt: mockSavedPost.createdAt,
      updatedAt: mockSavedPost.updatedAt,
      totalLikes: 0,
      totalSave: 0,
      totalComments: 0,
    };
    jest.spyOn(postDtoLayer, "postDto").mockReturnValue(mockPostDto);

    // Call the service function
    const response = await addPost(userId, mockPostData, "fileContent");

    // Check the response
    expect(response.status).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("success");
    expect(response.data).toEqual(mockPostDto);

    // Ensure the mocked functions were called
    expect(postQueryLayer.saveImageOnCloud).toHaveBeenCalledWith("fileContent");
    expect(postQueryLayer.addPostQuery).toHaveBeenCalledWith(
      mockPostData.caption,
      mockPostData.region,
      mockImageUrl,
      userId
    );
    expect(populateLayer.populatePost).toHaveBeenCalledWith(mockSavedPost);
  });

  it("should return a failure response when no image is provided", async () => {
    // Call the service function without fileContent
    const response = await addPost(userId, mockPostData, undefined);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(response.message).toBe("image is required.");
    expect(response.data).toBeNull();
  });

  it("should handle image upload errors and return a failure response", async () => {
    // Mock the post image upload function to throw an error
    jest
      .spyOn(postQueryLayer, "saveImageOnCloud")
      .mockRejectedValue(new Error("Failed to upload image"));

    // Call the service function
    const response = await addPost(userId, mockPostData, "fileContent");

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Failed to upload image");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.saveImageOnCloud).toHaveBeenCalledWith("fileContent");
  });

  it("should handle database errors and return a failure response", async () => {
    // Mock the post image upload function to return a dummy URL
    jest
      .spyOn(postQueryLayer, "saveImageOnCloud")
      .mockResolvedValue(mockImageUrl);

    // Mock addPostQuery to throw a database error
    jest
      .spyOn(postQueryLayer, "addPostQuery")
      .mockRejectedValue(new Error("Database error"));

    // Call the service function
    const response = await addPost(userId, mockPostData, "fileContent");

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Database error");
    expect(response.data).toBeNull();

    // Ensure the mocked functions were called
    expect(postQueryLayer.saveImageOnCloud).toHaveBeenCalledWith("fileContent");
    expect(postQueryLayer.addPostQuery).toHaveBeenCalledWith(
      mockPostData.caption,
      mockPostData.region,
      mockImageUrl,
      userId
    );
  });
});

describe("getPostById Service", () => {
  // Define reusable mock data
  const postId = new mongoose.Types.ObjectId().toString();

  // Create a mock Mongoose Document that matches the IPost schema
  const mockPost = {
    _id: new mongoose.Types.ObjectId(postId),
    caption: "Test Caption",
    region: "USA",
    postImage: "https://somecloudstorage.com/image.jpg",
    postedBy: {
      _id: new mongoose.Types.ObjectId(),
      userName: "anand",
      profile: {
        _id: new mongoose.Types.ObjectId(),
        profilePicture: "https://somecloudstorage.com/profile.jpg",
      } as IProfile,
    } as IUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    save: jest.fn(),
    $isNew: false,
    $isDeleted: false,
    $__: {},
    $errors: null,
    $locals: {},
    $op: null,
    $where: {},
    $originalSave: jest.fn(),
    $__validate: jest.fn(),
    $__remove: jest.fn(),
    $__save: jest.fn(),
    $__validateSync: jest.fn(),
    $init: jest.fn(),
    $markValid: jest.fn(),
    $toObject: jest.fn().mockReturnValue({
      _id: new mongoose.Types.ObjectId(postId),
      caption: "Test Caption",
      region: "USA",
      postImage: "https://somecloudstorage.com/image.jpg",
      postedBy: {
        _id: new mongoose.Types.ObjectId(),
        userName: "anand",
        profile: {
          _id: new mongoose.Types.ObjectId(),
          profilePicture: "https://somecloudstorage.com/profile.jpg",
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    }),
  } as unknown as mongoose.Document<unknown, {}, IPost> &
    IPost & { _id: mongoose.Types.ObjectId; __v: number };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return a post when it exists", async () => {
    // Mock getPostByIdQuery to return a mock post
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(mockPost);

    // Mock populatePost to return the mock post
    jest.spyOn(populateLayer, "populatePost").mockResolvedValue(mockPost);

    // Mock the DTO conversion function
    const mockPostDto: IPostDto = {
      postId: mockPost._id.toString(),
      caption: mockPost.caption,
      region: mockPost.region,
      postImage: mockPost.postImage,
      postedBy: {
        userId: (mockPost.postedBy as IUser)._id.toString(),
        profileImage: ((mockPost.postedBy as IUser).profile as IProfile)
          .profilePicture,
        userName: (mockPost.postedBy as IUser).userName,
      },
      createdAt: mockPost.createdAt,
      updatedAt: mockPost.updatedAt,
      totalLikes: 0,
      totalSave: 0,
      totalComments: 0,
    };
    jest.spyOn(postDtoLayer, "postDto").mockReturnValue(mockPostDto);

    // Call the service function
    const response = await getPostById(postId);

    // Check the response
    expect(response.status).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("success");
    expect(response.data).toEqual(mockPostDto);

    // Ensure the mocked functions were called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
    expect(populateLayer.populatePost).toHaveBeenCalledWith(mockPost);
  });

  it("should return a failure response when the post is not found", async () => {
    // Mock getPostByIdQuery to return null (post not found)
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(null);

    // Call the service function
    const response = await getPostById(postId);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(404);
    expect(response.message).toBe("post not found.");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
  });

  it("should handle database errors and return a failure response", async () => {
    // Mock getPostByIdQuery to throw a database error
    jest
      .spyOn(postQueryLayer, "getPostByIdQuery")
      .mockRejectedValue(new Error("Database error"));

    // Call the service function
    const response = await getPostById(postId);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Database error");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
  });
});

describe("getAllPosts Service", () => {
  // Create mock posts
  const mockPosts = [
    {
      _id: new mongoose.Types.ObjectId(),
      caption: "Post 1 Caption",
      region: "USA",
      postImage: "https://somecloudstorage.com/image1.jpg",
      postedBy: {
        _id: new mongoose.Types.ObjectId(),
        userName: "user1",
        profile: {
          _id: new mongoose.Types.ObjectId(),
          profilePicture: "https://somecloudstorage.com/profile1.jpg",
        } as IProfile,
      } as IUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      save: jest.fn(),
      $isNew: false,
      $isDeleted: false,
      $__: {},
      $errors: null,
      $locals: {},
      $op: null,
      $where: {},
      $originalSave: jest.fn(),
      $__validate: jest.fn(),
      $__remove: jest.fn(),
      $__save: jest.fn(),
      $__validateSync: jest.fn(),
      $init: jest.fn(),
      $markValid: jest.fn(),
      $toObject: jest.fn().mockReturnValue({
        _id: new mongoose.Types.ObjectId(),
        caption: "Post 1 Caption",
        region: "USA",
        postImage: "https://somecloudstorage.com/image1.jpg",
        postedBy: {
          _id: new mongoose.Types.ObjectId(),
          userName: "user1",
          profile: {
            _id: new mongoose.Types.ObjectId(),
            profilePicture: "https://somecloudstorage.com/profile1.jpg",
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      }),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      caption: "Post 2 Caption",
      region: "Canada",
      postImage: "https://somecloudstorage.com/image2.jpg",
      postedBy: {
        _id: new mongoose.Types.ObjectId(),
        userName: "user2",
        profile: {
          _id: new mongoose.Types.ObjectId(),
          profilePicture: "https://somecloudstorage.com/profile2.jpg",
        } as IProfile,
      } as IUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      save: jest.fn(),
      $isNew: false,
      $isDeleted: false,
      $__: {},
      $errors: null,
      $locals: {},
      $op: null,
      $where: {},
      $originalSave: jest.fn(),
      $__validate: jest.fn(),
      $__remove: jest.fn(),
      $__save: jest.fn(),
      $__validateSync: jest.fn(),
      $init: jest.fn(),
      $markValid: jest.fn(),
      $toObject: jest.fn().mockReturnValue({
        _id: new mongoose.Types.ObjectId(),
        caption: "Post 2 Caption",
        region: "Canada",
        postImage: "https://somecloudstorage.com/image2.jpg",
        postedBy: {
          _id: new mongoose.Types.ObjectId(),
          userName: "user2",
          profile: {
            _id: new mongoose.Types.ObjectId(),
            profilePicture: "https://somecloudstorage.com/profile2.jpg",
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      }),
    },
  ] as unknown as (mongoose.Document<unknown, {}, IPost> & IPost & { _id: mongoose.Types.ObjectId; __v: number })[];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return all posts when they exist", async () => {
    // Mock getAllPostsQuery to return mock posts
    jest.spyOn(postQueryLayer, "getAllPostsQuery").mockResolvedValue(mockPosts);

    // Mock populateMultiplePost to simulate in-place population
    jest
      .spyOn(populateLayer, "populateMultiplePost")
      .mockImplementation(async (posts) => {
        posts.forEach((post) => {
          post.postedBy = {
            _id: new mongoose.Types.ObjectId(),
            userName: "user1",
            profile: {
              _id: new mongoose.Types.ObjectId(),
              profilePicture: "https://somecloudstorage.com/profile1.jpg",
            } as IProfile,
          } as IUser;
        });
        return Promise.resolve([]);
      });

    // Mock the DTO conversion function
    const mockPostDtos: IPostDto[] = mockPosts.map((post) => ({
      postId: post._id.toString(),
      caption: post.caption,
      region: post.region,
      postImage: post.postImage,
      postedBy: {
        userId: (post.postedBy as IUser)._id.toString(),
        profileImage: ((post.postedBy as IUser).profile as IProfile)
          .profilePicture,
        userName: (post.postedBy as IUser).userName,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      totalLikes: 0,
      totalSave: 0,
      totalComments: 0,
    }));
    jest.spyOn(postDtoLayer, "postDto").mockImplementation((post) => {
      const foundPost = mockPosts.find((p) => p._id.toString() === post._id.toString());
      return mockPostDtos.find((dto) => dto.postId === foundPost?._id.toString())!;
    });

    // Call the service function
    const response = await getAllPosts();

    // Check the response
    expect(response.status).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("success");
    expect(response.data).toEqual(mockPostDtos);

    // Ensure the mocked functions were called
    expect(postQueryLayer.getAllPostsQuery).toHaveBeenCalled();
    expect(populateLayer.populateMultiplePost).toHaveBeenCalledWith(mockPosts);
  });

  it("should handle database errors and return a failure response", async () => {
    // Mock getAllPostsQuery to throw a database error
    jest
      .spyOn(postQueryLayer, "getAllPostsQuery")
      .mockRejectedValue(new Error("Database error"));

    // Call the service function
    const response = await getAllPosts();

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Database error");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.getAllPostsQuery).toHaveBeenCalled();
  });
});

describe("updatePost Service", () => {
  // Define reusable mock data
  const userId = new mongoose.Types.ObjectId().toString();
  const postId = new mongoose.Types.ObjectId().toString();
  const mockUpdateData: IUpdatePostData = {
    postId: postId,
    isImageUpdated:"true",
    caption: "Updated Caption",
    region: "Updated Region",
  };
  const mockFileContent = "fileContent";

  // Create a mock Mongoose Document that matches the IPost schema
  const mockPost = {
    _id: new mongoose.Types.ObjectId(postId),
    caption: "Original Caption",
    region: "Original Region",
    postImage: "https://somecloudstorage.com/image.jpg",
    postedBy: new mongoose.Types.ObjectId(userId),
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    save: jest.fn(),
    $isNew: false,
    $isDeleted: false,
    $__: {},
    $errors: null,
    $locals: {},
    $op: null,
    $where: {},
    $originalSave: jest.fn(),
    $__validate: jest.fn(),
    $__remove: jest.fn(),
    $__save: jest.fn(),
    $__validateSync: jest.fn(),
    $init: jest.fn(),
    $markValid: jest.fn(),
    $toObject: jest.fn().mockReturnValue({
      _id: new mongoose.Types.ObjectId(postId),
      caption: "Updated Caption",
      region: "Updated Region",
      postImage: "https://somecloudstorage.com/updated-image.jpg",
      postedBy: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    }),
  } as unknown as mongoose.Document<unknown, {}, IPost> &
    IPost & { _id: mongoose.Types.ObjectId; __v: number };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should update a post and return a success response", async () => {
    // Mock getPostByIdQuery to return a mock post
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(mockPost);

    // Mock updatePostQuery to return the updated post
    jest.spyOn(postQueryLayer, "updatePostQuery").mockResolvedValue(mockPost);

    // Mock populatePost to return the updated post
    jest.spyOn(populateLayer, "populatePost").mockResolvedValue(mockPost);

    // Mock the DTO conversion function
    const mockPostDto: IPostDto = {
      postId: mockPost._id.toString(),
      caption: mockPost.caption,
      region: mockPost.region,
      postImage: mockPost.postImage,
      postedBy: {
        userId: mockPost.postedBy.toString(),
        profileImage: "https://somecloudstorage.com/profile.jpg",
        userName: "user1",
      },
      createdAt: mockPost.createdAt,
      updatedAt: mockPost.updatedAt,
      totalLikes: 0,
      totalSave: 0,
      totalComments: 0,
    };
    jest.spyOn(postDtoLayer, "postDto").mockReturnValue(mockPostDto);

    // Call the service function
    const response = await updatePost(userId, mockUpdateData, mockFileContent);

    // Check the response
    expect(response.status).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("success");
    expect(response.data).toEqual(mockPostDto);

    // Ensure the mocked functions were called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
    expect(postQueryLayer.updatePostQuery).toHaveBeenCalledWith(
      mockPost,
      mockUpdateData,
      mockFileContent
    );
    expect(populateLayer.populatePost).toHaveBeenCalledWith(mockPost);
  });

  it("should return a failure response when the post is not found", async () => {
    // Mock getPostByIdQuery to return null (post not found)
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(null);

    // Call the service function
    const response = await updatePost(userId, mockUpdateData, mockFileContent);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("post not found.");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
  });

  it("should handle database errors and return a failure response", async () => {
    // Mock getPostByIdQuery to return a mock post
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(mockPost);

    // Mock updatePostQuery to throw a database error
    jest
      .spyOn(postQueryLayer, "updatePostQuery")
      .mockRejectedValue(new Error("Database error"));

    // Call the service function
    const response = await updatePost(userId, mockUpdateData, mockFileContent);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Database error");
    expect(response.data).toBeNull();

    // Ensure the mocked functions were called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
    expect(postQueryLayer.updatePostQuery).toHaveBeenCalledWith(
      mockPost,
      mockUpdateData,
      mockFileContent
    );
  });
});

describe("deletePost Service", () => {
  // Define reusable mock data
  const userId = new mongoose.Types.ObjectId().toString();
  const postId = new mongoose.Types.ObjectId().toString();

  // Create a mock Mongoose Document that matches the IPost schema
  const mockPost = {
    _id: new mongoose.Types.ObjectId(postId),
    caption: "Test Caption",
    region: "USA",
    postImage: "https://somecloudstorage.com/image.jpg",
    postedBy: new mongoose.Types.ObjectId(userId),
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    save: jest.fn(),
    $isNew: false,
    $isDeleted: false,
    $__: {},
    $errors: null,
    $locals: {},
    $op: null,
    $where: {},
    $originalSave: jest.fn(),
    $__validate: jest.fn(),
    $__remove: jest.fn(),
    $__save: jest.fn(),
    $__validateSync: jest.fn(),
    $init: jest.fn(),
    $markValid: jest.fn(),
    $toObject: jest.fn().mockReturnValue({
      _id: new mongoose.Types.ObjectId(postId),
      caption: "Test Caption",
      region: "USA",
      postImage: "https://somecloudstorage.com/image.jpg",
      postedBy: new mongoose.Types.ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    }),
  } as unknown as mongoose.Document<unknown, {}, IPost> &
    IPost & { _id: mongoose.Types.ObjectId; __v: number };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should delete a post and return a success response", async () => {
    // Mock getPostByIdQuery to return a mock post
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(mockPost);

    // Mock deletePostQuery to return the deleted post
    jest.spyOn(postQueryLayer, "deletePostQuery").mockResolvedValue(mockPost);

    // Call the service function
    const response = await deletePost(userId, postId);

    // Check the response
    expect(response.status).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("Post deleted successfully");
    expect(response.data).toEqual({ postId });

    // Ensure the mocked functions were called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
    expect(postQueryLayer.deletePostQuery).toHaveBeenCalledWith(postId);
  });

  it("should return a failure response when the post is not found", async () => {
    // Mock getPostByIdQuery to return null (post not found)
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(null);

    // Call the service function
    const response = await deletePost(userId, postId);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("post not found.");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
  });

  it("should handle database errors and return a failure response", async () => {
    // Mock getPostByIdQuery to return a mock post
    jest.spyOn(postQueryLayer, "getPostByIdQuery").mockResolvedValue(mockPost);

    // Mock deletePostQuery to throw a database error
    jest
      .spyOn(postQueryLayer, "deletePostQuery")
      .mockRejectedValue(new Error("Database error"));

    // Call the service function
    const response = await deletePost(userId, postId);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Database error");
    expect(response.data).toBeNull();

    // Ensure the mocked functions were called
    expect(postQueryLayer.getPostByIdQuery).toHaveBeenCalledWith(postId);
    expect(postQueryLayer.deletePostQuery).toHaveBeenCalledWith(postId);
  });
});

describe("getMyPosts Service", () => {
  // Define reusable mock data
  const userId = new mongoose.Types.ObjectId().toString();

  // Create mock posts
  const mockPosts = [
    {
      _id: new mongoose.Types.ObjectId(),
      caption: "Post 1 Caption",
      region: "USA",
      postImage: "https://somecloudstorage.com/image1.jpg",
      postedBy: {
        _id: new mongoose.Types.ObjectId(userId),
        userName: "user1",
        profile: {
          _id: new mongoose.Types.ObjectId(),
          profilePicture: "https://somecloudstorage.com/profile1.jpg",
        } as IProfile,
      } as IUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      save: jest.fn(),
      $isNew: false,
      $isDeleted: false,
      $__: {},
      $errors: null,
      $locals: {},
      $op: null,
      $where: {},
      $originalSave: jest.fn(),
      $__validate: jest.fn(),
      $__remove: jest.fn(),
      $__save: jest.fn(),
      $__validateSync: jest.fn(),
      $init: jest.fn(),
      $markValid: jest.fn(),
      $toObject: jest.fn().mockReturnValue({
        _id: new mongoose.Types.ObjectId(),
        caption: "Post 1 Caption",
        region: "USA",
        postImage: "https://somecloudstorage.com/image1.jpg",
        postedBy: {
          _id: new mongoose.Types.ObjectId(userId),
          userName: "user1",
          profile: {
            _id: new mongoose.Types.ObjectId(),
            profilePicture: "https://somecloudstorage.com/profile1.jpg",
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      }),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      caption: "Post 2 Caption",
      region: "Canada",
      postImage: "https://somecloudstorage.com/image2.jpg",
      postedBy: {
        _id: new mongoose.Types.ObjectId(userId),
        userName: "user2",
        profile: {
          _id: new mongoose.Types.ObjectId(),
          profilePicture: "https://somecloudstorage.com/profile2.jpg",
        } as IProfile,
      } as IUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      save: jest.fn(),
      $isNew: false,
      $isDeleted: false,
      $__: {},
      $errors: null,
      $locals: {},
      $op: null,
      $where: {},
      $originalSave: jest.fn(),
      $__validate: jest.fn(),
      $__remove: jest.fn(),
      $__save: jest.fn(),
      $__validateSync: jest.fn(),
      $init: jest.fn(),
      $markValid: jest.fn(),
      $toObject: jest.fn().mockReturnValue({
        _id: new mongoose.Types.ObjectId(),
        caption: "Post 2 Caption",
        region: "Canada",
        postImage: "https://somecloudstorage.com/image2.jpg",
        postedBy: {
          _id: new mongoose.Types.ObjectId(userId),
          userName: "user2",
          profile: {
            _id: new mongoose.Types.ObjectId(),
            profilePicture: "https://somecloudstorage.com/profile2.jpg",
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      }),
    },
  ] as unknown as (mongoose.Document<unknown, {}, IPost> & IPost & { _id: mongoose.Types.ObjectId; __v: number })[];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return all posts for the given user", async () => {
    // Mock getPostsByUserIdQuery to return mock posts
    jest.spyOn(postQueryLayer, "getPostsByUserIdQuery").mockResolvedValue(mockPosts);

    // Mock populateMultiplePost to simulate in-place population
    jest
      .spyOn(populateLayer, "populateMultiplePost")
      .mockImplementation(async (posts) => {
        // Simulate population by modifying the posts in place
        posts.forEach((post) => {
          post.postedBy = {
            _id: new mongoose.Types.ObjectId(userId),
            userName: "user1",
            profile: {
              _id: new mongoose.Types.ObjectId(),
              profilePicture: "https://somecloudstorage.com/profile1.jpg",
            } as IProfile,
          } as IUser;
        });
        return Promise.resolve([]); // Return void[]
      });

    // Mock the DTO conversion function
    const mockPostDtos: IPostDto[] = mockPosts.map((post) => ({
      postId: post._id.toString(),
      caption: post.caption,
      region: post.region,
      postImage: post.postImage,
      postedBy: {
        userId: (post.postedBy as IUser)._id.toString(),
        profileImage: ((post.postedBy as IUser).profile as IProfile)
          .profilePicture,
        userName: (post.postedBy as IUser).userName,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      totalLikes: 0,
      totalSave: 0,
      totalComments: 0,
    }));
    jest.spyOn(postDtoLayer, "postDto").mockImplementation((post) => {
      const foundPost = mockPosts.find((p) => p._id.toString() === post._id.toString());
      return mockPostDtos.find((dto) => dto.postId === foundPost?._id.toString())!;
    });

    // Call the service function
    const response = await getMyPosts(userId);

    // Check the response
    expect(response.status).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("success");
    expect(response.data).toEqual(mockPostDtos);

    // Ensure the mocked functions were called
    expect(postQueryLayer.getPostsByUserIdQuery).toHaveBeenCalledWith(userId);
    expect(populateLayer.populateMultiplePost).toHaveBeenCalledWith(mockPosts);
  });

  it("should handle database errors and return a failure response", async () => {
    // Mock getPostsByUserIdQuery to throw a database error
    jest
      .spyOn(postQueryLayer, "getPostsByUserIdQuery")
      .mockRejectedValue(new Error("Database error"));

    // Call the service function
    const response = await getMyPosts(userId);

    // Check the error response
    expect(response.status).toBe(false);
    expect(response.statusCode).toBe(500);
    expect(response.message).toBe("Database error");
    expect(response.data).toBeNull();

    // Ensure the mocked function was called
    expect(postQueryLayer.getPostsByUserIdQuery).toHaveBeenCalledWith(userId);
  });
});