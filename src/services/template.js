import request from '~/utils';

export const requestUserGetTemplates = async (page) => {
    try {
        const res = await request.get('/my/templates', {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetTemplateBySlug = async (slug) => {
    try {
        const res = await request.get(`/my/templates/${slug}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserPaymentTemplate = async (data) => {
    try {
        const res = await request.post('/my/templates/payment', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
