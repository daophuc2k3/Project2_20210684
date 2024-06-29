import FetchBase from "./FetchBase";

class StatisticsAPI extends FetchBase {}

const statisticsAPI = new StatisticsAPI("/statistics");

export default statisticsAPI;
