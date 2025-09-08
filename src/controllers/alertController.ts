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

// Yearly Completion Alerts
export const checkYearlyCompletion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const today = new Date();
    const users = await User.find();

    const alertsToCreate: { forUsers: Types.ObjectId[], message: string }[] = [];

    for (const user of users) {
      const joinDate = new Date(user.createdAt);
      const oneYearAfterJoin = new Date(joinDate);
      oneYearAfterJoin.setFullYear(joinDate.getFullYear() + 1);

      if (
        today.getDate() === oneYearAfterJoin.getDate() &&
        today.getMonth() === oneYearAfterJoin.getMonth()
      ) {
        alertsToCreate.push({
          forUsers: [user._id],
          message: `🎉 Congratulations ${user.name}, today marks your work anniversary with us!`,
        });
      }
    }

    if (alertsToCreate.length > 0) {
      await Alert.insertMany(alertsToCreate);
    }

    res.status(200).json({
      success: true,
      message: "Yearly completion alerts created",
    });
  } catch (error) {
    next(error);
  }
};

export const getBirthdayAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    const birthdayUsers = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDate] },
          { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
        ],
      },
    });

  if (!birthdayUsers.length) return "No birthdays today";

  const allUsers = await User.find();

  for (const bUser of birthdayUsers) {
    const otherUsers = allUsers
      .filter((u) => !u._id.equals(bUser._id))
      .map((u) => u._id);

    if (otherUsers.length > 0) {
      await Alert.create({
        forUsers: otherUsers,
        message: `🎉 Today is ${bUser.name}'s birthday!`,
        image: bUser.profileImage
      });
    }

    await Alert.create({
      forUsers: [bUser._id],
      message: `🥳 Happy Birthday ${bUser.name}!`,
      image: bUser.profileImage
    });
  }

  return "Birthday alerts created ✅";
  } catch (error) {
    next(error);
  }
};