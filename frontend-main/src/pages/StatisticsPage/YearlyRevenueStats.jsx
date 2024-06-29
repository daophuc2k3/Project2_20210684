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

const YearlyRevenueStats = ({ data }) => {
  const chartData = useMemo(() => {
    const labels = data?.map((it) => it.year);

    const chartData = {
      labels,
      datasets: [
        {
          label: "Yearly revenue",
          data: data?.map((it) => it.total),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
      ],
    };

    return chartData;
  }, [data]);

  return (
    <div className={styles.statisticCard}>
      <div className={styles.header}>
        <p className={styles.title}>Yearly revenue statistic</p>
      </div>

      <div className={styles.content}>
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

YearlyRevenueStats.propTypes = {
  data: [],
};

export default YearlyRevenueStats;
