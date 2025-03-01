import request from '~/utils';

export const requestUserLogin = async (user) => {
    try {
        const res = await request.post('/my/auth/login', user);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserVerifyLogin = async (data) => {
    try {
        const res = await request.post('/my/auth/verify-login', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserLoginGoogle = async (token) => {
    try {
        const res = await request.post('/my/auth/login-google', token);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserRegister = async (user) => {
    try {
        const res = await request.post('/my/auth/register', user);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserLogout = async () => {
    try {
        const res = await request.post('/my/auth/logout');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetCurrent = async () => {
    try {
        const res = await request.get('/my/auth/current-user', {
            params: {
                _v: Math.random(),
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserVerifyOtpPassword = async (data) => {
    try {
        const res = await request.post('/my/auth/verify-otp', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserConfirmResetPassword = async (data) => {
    try {
        const res = await request.post('/my/auth/confirm-reset', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserSendCodeVerifyEmail = async (data) => {
    try {
        const res = await request.post('/my/auth/send-email-verify', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserSendCodeVerifyEmailRegister = async (email) => {
    try {
        const res = await request.post('/my/auth/send-email-register', { email });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
