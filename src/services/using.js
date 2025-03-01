import request from '~/utils';

export const requestUserGetServiceUsingOrderTemplates = async () => {
    try {
        const res = await request.get('/my/usings/templates');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetServiceUsingOrderInstances = async () => {
    try {
        const res = await request.get('/my/usings/instances');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
