import request from '~/utils';

export const requestUserGetConfigApps = async () => {
    try {
        const res = await request.get('/my/apps');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
