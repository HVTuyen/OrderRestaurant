// datetimeUtils.js
const addLeadingZero = (number) => {
    return number < 10 ? '0' + number : number;
};

export const formatDateTimeSQL = (sqlDateTimeString) => {
    const dateTime = new Date(sqlDateTimeString);
    const day = addLeadingZero(dateTime.getDate());
    const month = addLeadingZero(dateTime.getMonth() + 1); // Tháng bắt đầu từ 0
    const year = dateTime.getFullYear();
    const hours = addLeadingZero(dateTime.getHours());
    const minutes = addLeadingZero(dateTime.getMinutes());
    return `${day}/${month}/${year} | ${hours}:${minutes}`;
};

export const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = addLeadingZero(date.getMonth() + 1);
    const day = addLeadingZero(date.getDate());
    const hours = addLeadingZero(date.getHours());
    const minutes = addLeadingZero(date.getMinutes());
    return `${day}/${month}/${year} | ${hours}:${minutes}`;
};