import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Form, Input, notification } from 'antd';

import HookUrl from './HookUrl';
import router from '~/configs/routes';
import IconQuestion from '~/assets/icon/IconQuestion';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserUpdateApikey } from '~/services/account';

function Webhook({ webhooks, api_key }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (webhooks) {
            if (webhooks.url.length > 0) {
                form.setFieldsValue({ url: [{ list: webhooks.url }] });
            } else {
                form.setFieldsValue({ url: [{ list: [{ domain: '' }] }] });
            }

            form.setFieldValue('security_key', webhooks.security_key);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webhooks]);

    const handleUpdateWebhook = async (values) => {
        if (!api_key) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng nhập apikey để thêm cấu hình',
            });
        }

        const isUrl = values.url[0].list.filter((url) => url.domain !== '');
        if (isUrl.length < 1) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng nhập tên miền để thêm cấu hình',
            });
        }

        const data = {
            api_key,
            security_key: values.security_key,
            url: values.url[0].list,
        };

        const result = await requestUserUpdateApikey(data, 'config');

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleDestroyWebhook = async () => {
        if (!api_key) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng nhập apikey để xóa cấu hình',
            });
        }

        const result = await requestUserUpdateApikey({ api_key }, 'destroy');

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            form.setFieldValue('security_key', '');
            form.setFieldsValue({ url: [{ list: [{ domain: '' }] }] });

            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleUpdateWebhook}>
            <Flex className="gap-2">
                <IconQuestion className="mt-3" title="Chỉ tên miền trong danh sách này được phép dùng apikey này" />
                <HookUrl />
            </Flex>

            <Flex className="gap-2">
                <IconQuestion className="mt-3" title="Key bảo được đính kèm theo headers request chỉ khi mã hợp lệ mới được thông qua" />
                <Form.Item name="security_key" className="flex-1">
                    <Input
                        addonBefore="Key bảo mật"
                        placeholder="Có thể bỏ qua nếu không cần thiết"
                        size="large"
                        style={{ width: '95%' }}
                    />
                </Form.Item>
            </Flex>

            <Flex align="center" justify="center" className="mt-5 gap-2">
                <Button size="large" onClick={handleDestroyWebhook}>
                    Xoá cấu hình
                </Button>
                <Button type="primary" size="large" htmlType="submit">
                    Lưu thay đổi
                </Button>
            </Flex>
        </Form>
    );
}

export default Webhook;
