import moment from "moment";

export const sleep = (ms = 500) => new Promise((rs) => setTimeout(rs, ms));

export const remainingMonthsInYear = () => {
  const currentDate = new Date(); // Get the current date
  const currentMonth = currentDate.getMonth(); // Get the current month (0 to 11)
  const remainingMonths = 12 - currentMonth; // Calculate the remaining months in the year

  const remainingMonthsArray = [];
  for (let i = 0; i < remainingMonths; i++) {
    remainingMonthsArray.push(currentMonth + i); // Add remaining months to the array
  }

  return remainingMonthsArray;
};

export const remainingDaysInWeek = () => {
  const remainingDays = 7; // Calculate the remaining days in the week

  const remainingDaysArray = [];
  for (let i = 0; i < remainingDays; i++) {
    remainingDaysArray.push(i); // Add day names to the array
  }

  return remainingDaysArray;
};

export const findDayOfWeekInMonth = (dayOfWeek, month, year) => {
  const result = [];
  // Xác định số ngày trong tháng
  const daysInMonth = new Date(year, month, 0).getDate();

  // Loop qua tất cả các ngày trong tháng
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day); // month - 1 vì tháng trong JavaScript bắt đầu từ 0
    if (date.getDay() === dayOfWeek) {
      // Nếu ngày trong tuần của ngày này là ngày cần tìm, thêm vào kết quả
      result.push(moment(new Date(date)).format("DD/MM/YYYY"));
    }
  }

  return result;
};

export const filterDatesBeforeToday = (dateArray) => {
  const currentDate = moment(); // Lấy ngày hiện tại

  // Sử dụng filter để lọc ra các ngày trong mảng mà lớn hơn hoặc bằng ngày hiện tại
  const filteredDates = dateArray.filter((date) => {
    const currentDateMoment = moment(date, "DD/MM/YYYY"); // Chuyển đổi ngày trong mảng thành đối tượng Moment

    // So sánh ngày trong mảng với ngày hiện tại
    return currentDateMoment.isSameOrAfter(currentDate, "day");
  });

  return filteredDates;
};
