import request from '~/utils';

export const requestUserUploadImage = async (data) => {
    try {
        const res = await request.post('/upload/image', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
