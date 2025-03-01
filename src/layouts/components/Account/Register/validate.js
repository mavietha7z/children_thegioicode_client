export const validateFullName = (_, value) => {
    if (!value) {
        return Promise.reject(new Error('Vui lòng nhập họ và tên'));
    }
    const words = value.trim().split(/\s+/);
    if (words.length < 2) {
        return Promise.reject(new Error('Họ tên bao gồm ít nhất hai từ'));
    }
    if (words.some((word) => word.length < 2)) {
        return Promise.reject(new Error('Mỗi từ có ít nhất hai ký tự'));
    }
    return Promise.resolve();
};
