import request from '~/utils';

export const requestUserGetConfigApps = async () => {
    try {
        const res = await request.get('/my/apps');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetNewsFeeds = async () => {
    try {
        const res = await request.get('/my/apps/news-feeds');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserLikeNewsFeeds = async (data) => {
    try {
        const res = await request.post('/my/apps/news-feeds/like', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
