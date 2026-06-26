import Notification from '../model/Notification.js';

// 1. GET ALL NOTIFICATIONS FOR A SPECIFIC USER

export const getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch notifications and sort them by newest first (_id contains timestamp in MongoDB)
    const notifications = await Notification.find({ userId }).sort({ _id: -1 });
    
    return res.json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 2. MARK ALL UNREAD NOTIFICATIONS AS READ

export const markNotificationsAsRead = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Update all unread alerts for this user to true
    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error updating notifications status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
