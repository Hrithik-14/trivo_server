import { Request, Response, NextFunction } from "express";
import Alert from "../models/alert";
import mongoose, { Types } from "mongoose";
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

    
    const objectId = new mongoose.Types.ObjectId(userId);

    const alerts = await Alert.find({ forUsers: { $in: [objectId] } })
      .sort({ createdAt: -1 });

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



export const checkYearlyCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const today = new Date();

    
    const completedUsers = await User.find({
      createdAt: {
        $lte: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      },
    });

    if (completedUsers.length > 0) {
      console.log(`🎉 ${completedUsers.length} user(s) completed 1 year!`);

      for (const user of completedUsers) {
        console.log(`✅ User ${user._id} (${user.email}) completed 1 year.`);

        // Save alert for this user
        await Alert.create({
          forUser: user._id,
          message: `🎉 Congratulations ${user.name}, you have completed 1 year with us!`,
          createdAt: new Date(),
        });
      }
    } else {
      console.log("ℹ️ No users completed 1 year today.");
    }

    if (res) {
      return res.status(200).json({ success: true, completedUsers });
    }
  } catch (error) {
    console.error("❌ Error in yearly completion check:", error);
    if (next) next(error);
  }
};



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