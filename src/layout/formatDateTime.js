// datetimeUtils.js
const addLeadingZero = (number) => {
    return number < 10 ? '0' + number : number;
};

export const formatDateTime = (sqlDateTimeString) => {
    const dateTime = new Date(sqlDateTimeString);
    const day = addLeadingZero(dateTime.getDate());
    const month = addLeadingZero(dateTime.getMonth() + 1); // Tháng bắt đầu từ 0
    const year = dateTime.getFullYear();
    const hours = addLeadingZero(dateTime.getHours());
    const minutes = addLeadingZero(dateTime.getMinutes());
    return `${day}/${month}/${year} | ${hours}:${minutes}`;
};
