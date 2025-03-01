import request from '~/utils';

export const requestUserGetSources = async (page, category) => {
    try {
        const res = await request.get('/my/sources', {
            params: {
                page,
                category,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetSourceBySlug = async (slug) => {
    try {
        const res = await request.get(`/my/sources/${slug}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
