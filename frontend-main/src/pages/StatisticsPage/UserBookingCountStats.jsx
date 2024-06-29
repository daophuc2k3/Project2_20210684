import { Bar } from "react-chartjs-2";
import styles from "./index.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  barPercentage: 0.2,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

const UserBookingCountStats = ({ data }) => {
  const chartData = useMemo(() => {
    const labels = data?.map((it) => it.user.displayName);

    const chartData = {
      labels,
      datasets: [
        {
          label: "User booking count",
          data: data?.map((it) => it.bookingCount),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };

    return chartData;
  }, [data]);

  return (
    <div className={styles.statisticCard}>
      <div className={styles.header}>
        <p className={styles.title}>User booking count statistic</p>
      </div>

      <div className={styles.content}>
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

UserBookingCountStats.propTypes = {
  data: [],
};

export default UserBookingCountStats;
