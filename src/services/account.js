import request from '~/utils';

export const requestUserGetLoginHistories = async (page) => {
    try {
        const res = await request.get('/my/accounts/history-login', {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserUpdateProfile = async (data) => {
    try {
        const res = await request.put('/my/accounts/profile', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetApikey = async () => {
    try {
        const res = await request.get('/my/accounts/apikey');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserUpdateApikey = async (data, action = null) => {
    try {
        const res = await request.put('/my/accounts/apikey/update', data, {
            params: {
                action,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetNotifications = async (modun, page) => {
    try {
        const res = await request.get('/my/accounts/notifications', {
            params: {
                modun,
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserUnreadNotification = async (data) => {
    try {
        const res = await request.post('/my/accounts/notifications/unread', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserChangePassword = async (data) => {
    try {
        const res = await request.post('/my/accounts/password-change', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserVerifyPassword = async (data) => {
    try {
        const res = await request.post('/my/accounts/verify-password', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserSecurityEnable2Fa = async (data) => {
    try {
        const res = await request.post('/my/accounts/security/enable-2fa', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserSecurityVerify2Fa = async (data) => {
    try {
        const res = await request.post('/my/accounts/security/verify-2fa', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserSecurityTurnoff2Fa = async (data) => {
    try {
        const res = await request.post('/my/accounts/security/turnoff-2fa', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetBonusPoints = async (type, page) => {
    try {
        const res = await request.get('/my/accounts/bonus-points', {
            params: { type, page },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserExchangeBonusPoint = async (data) => {
    try {
        const res = await request.post('/my/accounts/bonus-points/exchange', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserCreateTokenApi = async (data) => {
    try {
        const res = await request.post('/my/accounts/partner', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
