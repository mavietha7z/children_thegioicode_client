import request from '~/utils';

export const requestUserGetResourceCategories = async (page) => {
    try {
        const res = await request.get('/my/resources/categories', {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetResourceProducts = async (page, slug_url) => {
    try {
        const res = await request.get(`/my/resources/categories/${slug_url}`, {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
