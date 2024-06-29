const StatisticsService = require("../services/statistics.service");
const { Ok } = require("../utils/success.response");

class StatisticsController {
  userBookings = async (req, res) => {
    const response = await StatisticsService.userBookings();

    return new Ok({
      message: "Get all statistics user booking successfully",
      metadata: response,
    }).send(res);
  };

  footballBooked = async (req, res) => {
    const response = await StatisticsService.footballBooked();

    return new Ok({
      message: "Get all statistics football booked successfully",
      metadata: response,
    }).send(res);
  };

  revenue = async (req, res) => {
    const response = await StatisticsService.revenue();

    return new Ok({
      message: "Get all revenue statistic successfully",
      metadata: response,
    }).send(res);
  };
}

module.exports = new StatisticsController();
