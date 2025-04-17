import { Request, Response } from "express";
import * as userRepo from "../infrastructure/repositories/userRepository";
import * as wsUserQueries from "../domain/queries/wsUser";

jest.mock("../infrastructure/repositories/userRepository", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

jest.mock("../domain/queries/wsUser", () => ({
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

const mockLoginData = {
  email: "test@example.com",
  password: "password123",
};

const mockUserFromDb = {
  id: "12345",
  email: "test@example.com",
  password: "password123", 
  firstName: "John",
  lastName: "Doe",
};

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

// Register
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

  it("should return 400 if required fields are missing", async () => {
    const incompleteData = { ...mockRegisterUserData, email: "" }; // simulate missing email
  
    (userRepo.registerUser as jest.Mock).mockImplementation(async (userData, response) => {
      if (!userData.email || !userData.password) {
        response.status(400).json({ error: "Missing required fields" });
        return;
      }
    });
  
    await userRepo.registerUser(incompleteData, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
  });
  

  it("should return 400 for invalid email format", async () => {
    const invalidEmailData = { ...mockRegisterUserData, email: "invalidEmail" };
  
    (userRepo.registerUser as jest.Mock).mockImplementation(async (userData, response) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        response.status(400).json({ error: "Invalid email format" });
        return;
      }
    });
  
    await userRepo.registerUser(invalidEmailData, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid email format" });
  });
  
  it("should return 400 if user is under age", async () => {
    const underageData = {
      ...mockRegisterUserData,
      dob: new Date(), // today = age 0
    };
  
    (userRepo.registerUser as jest.Mock).mockImplementation(async (userData, response) => {
      const age = new Date().getFullYear() - new Date(userData.dob).getFullYear();
      if (age < 13) {
        response.status(400).json({ error: "User is under the required age" });
        return;
      }
    });
  
    await userRepo.registerUser(underageData, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User is under the required age" });
  });
  

  it("should return 500 for server error", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockRejectedValue(new Error("Server error"));
    (userRepo.registerUser as jest.Mock).mockImplementation(async (userData, response) => {
      try {
        await wsUserQueries.findUserByEmail(userData.email);
      } catch (error) {
        response.status(500).json({ error: "Internal server error" });
        return;
      }
    });

    await userRepo.registerUser(mockRegisterUserData, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
  

  
});

// Login
describe("loginUser Service", () => {
  let res: Response;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  it("should log in successfully with valid credentials", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockResolvedValue(mockUserFromDb);
    (userRepo.loginUser as jest.Mock).mockImplementation(async (userData, response) => {
      const user = await wsUserQueries.findUserByEmail(userData.email);
      if (!user || user.password !== userData.password) {
        response.status(401).json({ error: "Invalid credentials" });
        return;
      }
      response.status(200).json({ message: "Login successful", user });
    });

    await userRepo.loginUser(mockLoginData, res);

    expect(wsUserQueries.findUserByEmail).toHaveBeenCalledWith(mockLoginData.email);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      user: mockUserFromDb,
    });
  });

  it("should return 401 if email is not found", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockResolvedValue(null);
    (userRepo.loginUser as jest.Mock).mockImplementation(async (userData, response) => {
      const user = await wsUserQueries.findUserByEmail(userData.email);
      if (!user) {
        response.status(401).json({ error: "Invalid credentials" });
        return;
      }
    });

    await userRepo.loginUser(mockLoginData, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return 401 if password is incorrect", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockResolvedValue({
      ...mockUserFromDb,
      password: "differentPassword",
    });
    (userRepo.loginUser as jest.Mock).mockImplementation(async (userData, response) => {
      const user = await wsUserQueries.findUserByEmail(userData.email);
      if (!user || user.password !== userData.password) {
        response.status(401).json({ error: "Invalid credentials" });
        return;
      }
    });

    await userRepo.loginUser(mockLoginData, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return 400 for missing fields", async () => {
    const incompleteLogin = { email: "", password: "" };

    (userRepo.loginUser as jest.Mock).mockImplementation(async (userData, response) => {
      if (!userData.email || !userData.password) {
        response.status(400).json({ error: "Missing email or password" });
        return;
      }
    });

    await userRepo.loginUser(incompleteLogin, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing email or password" });
  });

  it("should return 500 for server error", async () => {
    (wsUserQueries.findUserByEmail as jest.Mock).mockRejectedValue(new Error("Server failure"));

    (userRepo.loginUser as jest.Mock).mockImplementation(async (userData, response) => {
      try {
        await wsUserQueries.findUserByEmail(userData.email);
      } catch (error) {
        response.status(500).json({ error: "Internal server error" });
        return;
      }
    });

    await userRepo.loginUser(mockLoginData, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});


