// returns key for contact online status
export const getContactStatusKey = (id: string) => {
  return `contact_status:${id}`;
};

// returns key for receiving friend request
export const getFriendRequestKey = (id: string) => {
  return `friend_request:${id}`;
};

// returns key for messages sent by contacts
export const getContactMessagesKey = (id: string) => {
  return `contact_message:${id}`;
};