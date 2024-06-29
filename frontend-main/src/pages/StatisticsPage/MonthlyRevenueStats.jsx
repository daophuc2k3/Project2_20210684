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

const MonthlyRevenueStats = ({ data }) => {
  const chartData = useMemo(() => {
    const labels = data?.map((it) => `${it.info.month}/${it.info.year}`);

    const chartData = {
      labels,
      datasets: [
        {
          label: "Monthly revenue",
          data: data?.map((it) => it.total),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return chartData;
  }, [data]);

  return (
    <div className={styles.statisticCard}>
      <div className={styles.header}>
        <p className={styles.title}>Monthly revenue statistic</p>
      </div>

      <div className={styles.content}>
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

MonthlyRevenueStats.propTypes = {
  data: [],
};

export default MonthlyRevenueStats;
