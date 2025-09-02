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
        today.getMonth() === oneYearAfterJoin.getMonth() &&
        today.getFullYear() === oneYearAfterJoin.getFullYear()
      ) {
        alertsToCreate.push({
          forUsers: [user._id],
          message: `🎉 Congratulations ${user.name}, you’ve completed 1 year with us!`,
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

// Birthday Alerts
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

    if (!birthdayUsers.length) {
      return res.status(200).json({ message: "No birthdays today 🎂" });
    }

    const allUsers = await User.find();

    for (const bUser of birthdayUsers) {
      const otherUsers = allUsers
        .filter((u) => !u._id.equals(bUser._id))
        .map((u) => u._id);

      if (otherUsers.length > 0) {
        await Alert.create({
          forUsers: otherUsers,
          message: `🎉 Today is ${bUser.name}'s birthday!`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Birthday alerts created",
    });
  } catch (error) {
    next(error);
  }
};



export const getTodayBirthdays = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // months are 0-based
    const todayDate = today.getDate();

    // ✅ Get all users whose birthday is today
    const birthdayUsers = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$dateOfBirth" }, todayDate] },
          { $eq: [{ $month: "$dateOfBirth" }, todayMonth] },
        ],
      },
    });

    if (!birthdayUsers.length) {
      return res.status(200).json({
        success: true,
        message: "No birthdays today 🎂",
        users: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Today's birthday users",
      users: birthdayUsers,
    });
  } catch (error) {
    next(error);
  }
};



export const getTodayYearlyAlerts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    const yearlyUsers = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$joiningDate" }, todayDate] },
          { $eq: [{ $month: "$joiningDate" }, todayMonth] },
        ],
      },
    });

    if (!yearlyUsers.length) {
      return res.status(200).json({
        success: true,
        message: "No yearly anniversaries today 🎊",
        users: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Today's yearly anniversaries 🎉",
      users: yearlyUsers,
    });
  } catch (error) {
    next(error);
  }
};