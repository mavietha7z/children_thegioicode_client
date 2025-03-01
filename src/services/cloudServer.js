import request from '~/utils';

export const requestUserGetCloudServerRegions = async () => {
    try {
        const res = await request.get('/my/cloud-server/regions');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetCloudServerImages = async () => {
    try {
        const res = await request.get('/my/cloud-server/images');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetCloudServerProducts = async (plan_id) => {
    try {
        const res = await request.get(`/my/cloud-server/products/${plan_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
