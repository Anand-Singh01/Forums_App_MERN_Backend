import { ServiceResponse } from "../../util/interfaces";
import {
  addFeedbackQuery,
  updateFeedbackQuery,
  deleteFeedbackQuery,
  getFeedbackByIdQuery,
  getAllFeedbackByUserIdQuery,
} from "../../domain/queries/feedback";

export const addFeedback = async (
  header: string,
  description: string,
  userId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Feedback added successfully",
    status: true,
    statusCode: 400,
    data: null,
  };

  try {
    const feedback = await addFeedbackQuery(header, description, userId);
    response.data = feedback;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to add feedback";
    if (!response.statusCode || response.statusCode === 400) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};

export const updateFeedback = async (
  feedbackId: string,
  header: string,
  description: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Feedback updated successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const feedback = await updateFeedbackQuery(feedbackId, header, description);
    response.data = feedback;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to update feedback";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};

export const deleteFeedback = async (
  feedbackId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Feedback deleted successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const deletedFeedback = await deleteFeedbackQuery(feedbackId);
    if (!deletedFeedback) {
      response.statusCode = 404;
      throw new Error("Feedback not found.");
    }
    response.data = deletedFeedback;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to delete feedback";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};

export const getFeedbackById = async (
  feedbackId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Feedback retrieved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const feedback = await getFeedbackByIdQuery(feedbackId);
    if (!feedback) {
      response.statusCode = 404;
      throw new Error("Feedback not found.");
    }
    response.data = feedback;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to retrieve feedback";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};

export const getAllFeedbackByUserId = async (
  userId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Feedbacks retrieved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const feedbacks = await getAllFeedbackByUserIdQuery(userId);
    response.data = feedbacks;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to retrieve feedbacks";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};