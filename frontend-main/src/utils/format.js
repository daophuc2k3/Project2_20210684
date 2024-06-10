import moment from "moment";

export const formatDate = (date, format = "DD/MM/YYYY HH:mm:ss", oldFormat = "") =>
  moment(date, oldFormat ?? undefined).format(format);

export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export const calcTotalHour = (startTime, endTime) => {
  // Giờ bắt đầu và giờ kết thúc
  const fStartTime = moment(startTime, "HH:mm"); // Giờ bắt đầu: 08:30
  const fEndTime = moment(endTime, "HH:mm"); // Giờ kết thúc: 12:45

  // Tính khoảng thời gian giữa hai thời điểm
  const duration = moment.duration(fEndTime.diff(fStartTime));

  // Lấy số giờ từ khoảng thời gian
  const totalHours = duration.asHours();
  const hours = Math.floor(totalHours);
  const minutes = duration.minutes();

  return {
    totalHours,
    hours,
    minutes,
  };
};
