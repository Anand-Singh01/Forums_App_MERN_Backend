import dependencies from "../../infrastructure/dependencies";
import { ObjectId } from "mongodb";

// Add Feedback
export const addFeedbackQuery = async (
  header: string,
  description: string,
  userId: string
) => {
  const feedback = new dependencies.models.Feedback({
    header,
    description,
    user: userId,
  });
  await feedback.save();
  return feedback;
};

// Update Feedback
export const updateFeedbackQuery = async (
  feedbackId: string,
  header: string,
  description: string
) => {
  const feedback = await dependencies.models.Feedback.findById(feedbackId);
  if (!feedback) {
    throw new Error("Feedback not found.");
  }
  feedback.header = header;
  feedback.description = description;
  await feedback.save();
  return feedback;
};

// Delete Feedback
export const deleteFeedbackQuery = async (feedbackId: string) => {
  const deletedFeedback = await dependencies.models.Feedback.findByIdAndDelete(feedbackId);
  if (!deletedFeedback) {
    throw new Error("Feedback not found.");
  }
  return deletedFeedback;
};

// Get Feedback by ID
export const getFeedbackByIdQuery = async (feedbackId: string) => {
  const feedback = await dependencies.models.Feedback.findById(feedbackId);
  if (!feedback) {
    throw new Error("Feedback not found.");
  }
  return feedback;
};

// Get All Feedback by User ID
export const getAllFeedbackByUserIdQuery = async (userId: string) => {
  const feedbacks = await dependencies.models.Feedback.find({ user: userId });
  return feedbacks;
};