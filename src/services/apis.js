import request from '~/utils';

export const requestUserGetApis = async (page) => {
    try {
        const res = await request.get('/my/apis', {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetApiBySlug = async (slug) => {
    try {
        const res = await request.get(`/my/apis/${slug}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
