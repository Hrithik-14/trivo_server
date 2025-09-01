import { Request, Response, NextFunction } from "express";
import Alert from "../models/alert";
import { Types } from "mongoose";
import { User } from "../models/user";

export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    
    const alerts = await Alert.find({ forUsers: { $in: [userId] } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      alerts,
    });
  } catch (err) {
    next(err);
  }
};




export const markAlertAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    res.status(200).json({ success: true, message: "Alert marked as read", alert });
  } catch (err) {
    next(err);
  }
};

export const checkYearlyCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();

    // Get all users
    const users = await User.find();

    const alertsToCreate: { forUsers: Types.ObjectId[], message: string }[] = [];

    for (const user of users) {
      const joinDate = new Date(user.createdAt); // or user.dateOfJoining if you track it
      const oneYearAfterJoin = new Date(joinDate);
      oneYearAfterJoin.setFullYear(joinDate.getFullYear() + 1);

      // check if today is exactly the yearly completion
      if (
        today.getDate() === oneYearAfterJoin.getDate() &&
        today.getMonth() === oneYearAfterJoin.getMonth() &&
        today.getFullYear() === oneYearAfterJoin.getFullYear()
      ) {
        alertsToCreate.push({
          forUsers: [user._id],
          message: `🎉 Congratulations ${user.name}, you’ve completed 1 year with us!`,
        });
      }
    }

    // Create alerts if any
    if (alertsToCreate.length > 0) {
      await Alert.insertMany(alertsToCreate);
    }

    res.status(200).json({
      success: true,
      message: "Yearly completion check done",
      alertsCreated: alertsToCreate.length,
    });
  } catch (error) {
    next(error);
  }
};

// export const checkBirthdays = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Today's date (ignoring year)
//     const today = new Date();
//     const month = today.getMonth() + 1; // 0-indexed
//     const day = today.getDate();

//     // Find users whose birthday is today
//     const birthdayUsers = await User.find({
//       $expr: {
//         $and: [
//           { $eq: [{ $dayOfMonth: "$dateOfBirth" }, day] },
//           { $eq: [{ $month: "$dateOfBirth" }, month] }
//         ]
//       }
//     });

//     if (!birthdayUsers.length) {
//       return res.status(200).json({ success: true, message: "No birthdays today 🎂" });
//     }

//     // Get all users
//     const allUsers = await User.find({}, "_id");

//     for (const birthdayUser of birthdayUsers) {
//       // Exclude birthday user
//       const otherUserIds = allUsers
//         .map((u) => u._id)
//         .filter((id) => id.toString() !== birthdayUser._id.toString());

//       // Create an alert for all other users
//       await Alert.create({
//         forUsers: otherUserIds as Types.ObjectId[],
//         message: `Today is ${birthdayUser.name}'s birthday 🎉. Wish them a great day!`,
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Birthday alerts created successfully 🎉",
//     });
//   } catch (error) {
//     console.error("Error checking birthdays:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const getBirthdayAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    // Find birthday users today
    const birthdayUsers = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDate] },
          { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
        ],
      },
    });

    if (!birthdayUsers.length) {
      return res.status(200).json({ message: "No birthdays today 🎂" });
    }

    // Get all users
    const allUsers = await User.find();

    let alerts: any[] = [];

    for (const bUser of birthdayUsers) {
      const otherUsers = allUsers
        .filter((u) => !u._id.equals(bUser._id))
        .map((u) => u._id as Types.ObjectId);

      if (otherUsers.length > 0) {
        const alert = await Alert.create({
          forUsers: otherUsers,
          message: `🎉 Today is ${bUser.name}'s birthday!`,
        });
        alerts.push(alert);
      }
    }

    return res.status(200).json({
      message: "Birthday alerts fetched ✅",
      alerts,
    });
  } catch (error) {
    next(error);
  }
};