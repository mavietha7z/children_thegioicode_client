import router from './routes';
import { message } from 'antd';

// Hàm chuyển đổi số tiền thành chuỗi
export const convertCurrency = (number) => {
    if (number == null || number === undefined) {
        return 'Null';
    }

    const amount = Number(number);
    let check = typeof amount === 'number' ? true : false;

    return check ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ' : 'Null';
};

export const generateCateString = (str, maxLength = 10) => {
    if (!str) {
        return 'Null';
    }
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
};

export const serviceCopyKeyBoard = (text) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            message.success('Đã sao chép vào keyboard');
        })
        .catch((err) => {
            message.error(`Lỗi sao chép ${err}`);
        });
};

// Tính ngày hết hạn
export const calculateDaysLeft = (expirationDate) => {
    const currentDate = new Date();
    const expireDate = new Date(expirationDate);

    const timeDifference = expireDate - currentDate;

    const expiredLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (timeDifference <= 0) {
        return `Hết hạn ${Math.abs(expiredLeft)} ngày`;
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysLeft >= 1) {
        return `Còn ${daysLeft} ngày`;
    }

    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `Còn ${hoursLeft} giờ ${minutesLeft} phút`;
};

export function checkImage(urlImage) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = function () {
            resolve(urlImage);
        };

        img.onerror = function () {
            reject(null);
        };

        img.src = urlImage;
    });
}

export const shortNumberConversion = (number) => {
    if (number >= 1000000000) {
        // Hàng tỷ (Billion)
        return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (number >= 1000000) {
        // Hàng triệu (Million)
        return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (number >= 10000) {
        // Hàng chục nghìn (Thousand)
        return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    // Trả về số gốc nếu nhỏ hơn 10,000
    return number.toString();
};

export const configValidateDomain = (_, value) => {
    if (!value) {
        return Promise.resolve();
    }

    // Regex chỉ chấp nhận các URL bắt đầu bằng https:// và theo sau là tên miền
    const urlRegex = /^(https:\/\/)(([a-zA-Z0-9-]+\.)+([a-zA-Z0-9-]{2,63}))$/;

    if (urlRegex.test(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Ví dụ: https://thegioicode.com'));
    }
};

export const generateRandomPassword = (upperCount = 3, lowerCount = 3, numberCount = 3, specialCount = 3) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    let password = '';

    // Hàm chọn ký tự ngẫu nhiên từ một chuỗi
    function getRandomChar(charSet) {
        return charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    // Thêm ký tự chữ hoa vào mật khẩu
    for (let i = 0; i < upperCount; i++) {
        password += getRandomChar(uppercase);
    }

    // Thêm ký tự chữ thường vào mật khẩu
    for (let i = 0; i < lowerCount; i++) {
        password += getRandomChar(lowercase);
    }

    // Thêm ký tự số vào mật khẩu
    for (let i = 0; i < numberCount; i++) {
        password += getRandomChar(numbers);
    }

    // Thêm ký tự đặc biệt vào mật khẩu
    for (let i = 0; i < specialCount; i++) {
        password += getRandomChar(specialChars);
    }

    // Trộn các ký tự trong mật khẩu để đảm bảo mật khẩu ngẫu nhiên
    password = password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return password;
};

const config = {
    router,
};

export default config;
