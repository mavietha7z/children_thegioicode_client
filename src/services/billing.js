import request from '~/utils';

export const requestUserGetRecharge = async () => {
    try {
        const res = await request.get('/my/billings/recharge');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserRechargeCharging = async (data) => {
    try {
        const res = await request.post('/my/billings/recharge/chargingws', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetChargings = async () => {
    try {
        const res = await request.get('/my/billings/recharge/chargingws');

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetBalances = async (page) => {
    try {
        const res = await request.get('/my/billings/balances', {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetOrders = async (page) => {
    try {
        const res = await request.get(`/my/billings/orders`, {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetOrderDetail = async (order_id) => {
    try {
        const res = await request.get(`/my/billings/orders/${order_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserPaymentOrder = async (order_id) => {
    try {
        const res = await request.post(`/my/billings/orders/payment/${order_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserCancelledOrder = async (order_id) => {
    try {
        const res = await request.post(`/my/billings/orders/canceled/${order_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetInvoices = async (page) => {
    try {
        const res = await request.get(`/my/billings/invoices`, {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetInvoiceDetail = async (invoice_id) => {
    try {
        const res = await request.get(`/my/billings/invoices/${invoice_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserPaymentInvoice = async (order_id) => {
    try {
        const res = await request.post(`/my/billings/invoices/payment/${order_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetBillingSources = async (page) => {
    try {
        const res = await request.get(`/my/billings/sources`, {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetOrderTemplate = async (page) => {
    try {
        const res = await request.get(`/my/billings/templates`, {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetTemplateDetail = async (template_id) => {
    try {
        const res = await request.get(`/my/billings/templates/${template_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserActionTemplate = async (action, template_id) => {
    try {
        const res = await request.get(`/my/billings/templates/${action}/${template_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetOrderInstances = async (page) => {
    try {
        const res = await request.get(`/my/billings/instances`, {
            params: {
                page,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetInstanceDetail = async (instance_id) => {
    try {
        const res = await request.get(`/my/billings/instances/${instance_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserActionInstance = async (action, instance_id) => {
    try {
        const res = await request.get(`/my/billings/instances/${action}/${instance_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserRebuildInstance = async (data) => {
    try {
        const res = await request.post('/my/billings/instances/rebuild', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserGetProductResizeInstance = async (instance_id) => {
    try {
        const res = await request.get(`/my/billings/instances/resize/${instance_id}`);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserResizeInstance = async (data) => {
    try {
        const res = await request.post('/my/billings/instances/resize', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUserRenameInstance = async (data) => {
    try {
        const res = await request.post('/my/billings/instances/rename', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
