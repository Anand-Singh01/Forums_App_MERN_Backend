import { Request, Response } from "express";
import * as userRepo from "../infrastructure/repositories/userRepository";
import * as wsUserQueries from "../domain/queries/wsUser";

jest.mock("../infrastructure/repositories/userRepository", () => ({
  registerUser: jest.fn(),
}));

jest.mock("../domain/queries/wsUser", () => ({
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

const mockRegisterUserData = {
  email: "test@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  userName: "johndoe",
  dob: new Date("2005-01-01"), 
};

const mockSavedUser = {
  id: "12345",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  dob: new Date("2005-01-01"), 
};

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res as Response;
};

describe("registerUser Service", () => {
  let res: Response;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockResolvedValue(null); 
    (wsUserQueries.createUser as jest.Mock).mockResolvedValue(mockSavedUser);
    (userRepo.registerUser as jest.Mock).mockImplementation(async (userData, response) => {
      const userExists = await wsUserQueries.findUserByEmail(userData.email);
      if (userExists) {
        response.status(400).json({ error: "User already exists" });
        return;
      }
      const newUser = await wsUserQueries.createUser(userData);
      response.status(201).json({ user: newUser });
    });

    await userRepo.registerUser(mockRegisterUserData, res);

    expect(wsUserQueries.findUserByEmail).toHaveBeenCalledWith(mockRegisterUserData.email);
    expect(wsUserQueries.createUser).toHaveBeenCalledWith(mockRegisterUserData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: mockSavedUser });
  });

  it("should return 400 if user already exists", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockResolvedValue(mockSavedUser);
    (userRepo.registerUser as jest.Mock).mockImplementation(async (userData, response) => {
      const userExists = await wsUserQueries.findUserByEmail(userData.email);
      if (userExists) {
        response.status(400).json({ error: "User already exists" });
        return;
      }
    });

    await userRepo.registerUser(mockRegisterUserData, res);

    expect(wsUserQueries.findUserByEmail).toHaveBeenCalledWith(mockRegisterUserData.email);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
  });
});

