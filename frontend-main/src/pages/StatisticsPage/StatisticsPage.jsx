import { formatPrice } from "@utils/format";
import styles from "./index.module.css";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { useStatistics } from "@features/statistics/statisticsSlice";
import { useEffect } from "react";
import {
  fetchFootballBookedCountStats,
  fetchRevenueStatistics,
  fetchUserBookingCountStats,
} from "@features/statistics/statisticsThunk";
import MonthlyRevenueStats from "./MonthlyRevenueStats";
import YearlyRevenueStats from "./YearlyRevenueStats";
import FootballBookedCountStats from "./FootballBookedCountStats";
import UserBookingCountStats from "./UserBookingCountStats";
import Metadata from "@components/shared/Metadata";

const StatisticsPage = () => {
  const dispatch = useDispatch();

  const { revenueStatistics, footballBooked, userBookingCount } =
    useStatistics();

  useEffect(() => {
    dispatch(fetchRevenueStatistics());
    dispatch(fetchFootballBookedCountStats());
    dispatch(fetchUserBookingCountStats());
  }, [dispatch]);

  return (
    <>
      <Metadata title="Statistics" />

      <div className={styles.container}>
        <div
          className={classNames(styles.statisticCard, styles.totalRevenueCard)}
        >
          <div className={styles.header}>
            <p className={styles.title}>Total Revenue</p>
          </div>

          <div className={styles.content}>
            {formatPrice(revenueStatistics?.totalRevenue)}
          </div>
        </div>

        <MonthlyRevenueStats data={revenueStatistics?.monthlyRevenue} />

        <YearlyRevenueStats data={revenueStatistics?.yearlyRevenue} />

        <FootballBookedCountStats data={footballBooked} />

        <UserBookingCountStats data={userBookingCount} />
      </div>
    </>
  );
};

export default StatisticsPage;
