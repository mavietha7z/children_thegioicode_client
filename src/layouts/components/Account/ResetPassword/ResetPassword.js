import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Fragment, useState } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { Button, Input, Form, Spin, notification, message } from 'antd';

import router from '~/configs/routes';
import { generateRandomPassword } from '~/configs';
import favIconLogo from '~/assets/image/favicon.png';
import { requestUserConfirmResetPassword } from '~/services/auth';

function ResetPassword({ setModule, email, otp }) {
    const [loadingButton, setLoadingButton] = useState(false);

    const [form] = Form.useForm();
    const { configs } = useSelector((state) => state.apps);

    const handleGeneratePassword = () => {
        const randomPassword = generateRandomPassword(3, 3, 3, 3);

        form.setFieldValue('new_password', randomPassword);
        form.setFieldValue('renew_password', randomPassword);

        navigator.clipboard
            .writeText(randomPassword)
            .then(() => {
                message.success('Đã sao chép vào keyboard');
            })
            .catch((err) => {
                message.error(`Lỗi sao chép ${err}`);
            });
    };

    const handleSubmitResetPassword = async (values) => {
        const { new_password, renew_password } = values;

        if (new_password !== renew_password) {
            return notification.error({ message: 'Thông báo', description: 'Mật khẩu mới và nhập lại không trùng khớp' });
        }

        setLoadingButton(true);
        const data = {
            otp,
            email,
            new_password,
            renew_password,
        };

        const result = await requestUserConfirmResetPassword(data);

        setLoadingButton(false);
        if (result.status === 200) {
            setModule('login');

            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <Fragment>
            <div className="form_account-header">
                <Link to={router.home}>
                    <img src={configs?.favicon_url || favIconLogo} alt="" style={{ width: 40, height: 40 }} />
                </Link>

                <h3 className="my-2 font-bold font-size-30">Đặt lại mật khẩu</h3>
                <p className="mb-2 text-center">Chọn một mật khẩu mới, mạnh và tối thiểu 6 ký tự tối đa 30 kí tự.</p>
            </div>

            <div className="form_account-form">
                <Form form={form} name="horizontal_login" onFinish={handleSubmitResetPassword}>
                    <Form.Item
                        name="new_password"
                        className="mt-6"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới',
                            },
                            {
                                pattern: /^\S{6,30}$/,
                                message: 'Mật khẩu không hợp lệ',
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                        name="renew_password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập nhập lại mật khẩu mới',
                            },
                            {
                                pattern: /^\S{6,30}$/,
                                message: 'Mật khẩu không hợp lệ',
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>

                    <Form.Item shouldUpdate>
                        {() => (
                            <Button type="primary" htmlType="submit" size="large" disabled={loadingButton} style={{ width: '100%' }}>
                                {loadingButton ? <Spin /> : <Fragment>KHÔI PHỤC</Fragment>}
                            </Button>
                        )}
                    </Form.Item>
                </Form>
                <Button size="large" className="box-center w-full" onClick={handleGeneratePassword}>
                    <IconRefresh size={20} />
                    <span className="ml-2">Tạo mật khẩu</span>
                </Button>
            </div>
        </Fragment>
    );
}

export default ResetPassword;
