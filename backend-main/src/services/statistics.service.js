const OrderModel = require("../models/order.model");
const OrderDetailModel = require("../models/orderDetails.model");

class StatisticsService {
  static userBookings = async () => {
    const result = await OrderModel.aggregate([
      {
        $group: {
          _id: "$user",
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          bookingCount: 1,
          user: {
            _id: "$user._id",
            displayName: "$user.displayName",
            email: "$user.email",
          },
        },
      },
    ]);

    return result;
  };

  static footballBooked = async () => {
    const result = await OrderDetailModel.aggregate([
      {
        $group: {
          _id: "$football",
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "Footballs",
          localField: "_id",
          foreignField: "_id",
          as: "football",
        },
      },
      {
        $unwind: "$football",
      },
      {
        $project: {
          _id: 0,
          footballId: "$_id",
          orderCount: 1,
          football: {
            _id: "$football._id",
            name: "$football.name",
          },
        },
      },
    ]);

    return result;
  };

  static revenue = async () => {
    const result = await OrderDetailModel.aggregate([
      {
        $match: { status: "finished" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalCost" },
        },
      },
    ]);

    const revenueByMonth = await OrderDetailModel.aggregate([
      {
        $match: { status: "finished" },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$totalCost" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          info: {
            year: "$_id.year",
            month: "$_id.month",
          },
          total: 1,
        },
      },
    ]);

    const revenueByYear = await OrderDetailModel.aggregate([
      {
        $match: { status: "finished" },
      },
      {
        $group: {
          _id: { year: { $year: "$date" } },
          total: { $sum: "$totalCost" },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          total: 1,
        },
      },
    ]);

    return {
      totalRevenue: result.length > 0 ? result[0].totalRevenue : 0,
      monthlyRevenue: revenueByMonth,
      yearlyRevenue: revenueByYear,
    };
  };
}

module.exports = StatisticsService;
