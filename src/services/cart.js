import request from '~/utils';

export const requestUserGetCart = async () => {
    try {
        const res = await request.get('/my/cart');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserClearCart = async (data) => {
    try {
        const res = await request.put('/my/cart/clear', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserChangeCycles = async (data) => {
    try {
        const res = await request.put('/my/cart/cycles', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserPaymentCart = async () => {
    try {
        const res = await request.post('/my/cart/payment');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserAddProductToCart = async (category, data) => {
    try {
        const res = await request.post(`/my/cart/add/${category}`, data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserApplyCoupon = async (data) => {
    try {
        const res = await request.post('/my/cart/apply-coupon', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserRemoveCoupon = async (id) => {
    try {
        const res = await request.get(`/my/cart/remove-coupon/${id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
