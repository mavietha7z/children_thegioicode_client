import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Fragment, useState, useEffect } from 'react';
import { Button, Input, Form, notification, Space } from 'antd';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import router from '~/configs/routes';
import { validateFullName } from './validate';
import favIconLogo from '~/assets/image/favicon.png';
import { requestUserRegister, requestUserSendCodeVerifyEmailRegister } from '~/services/auth';

const validateOtp = (rule, value) => {
    if (!value) {
        return Promise.reject('Vui lòng nhập mã xác nhận');
    }
    if (value.length !== 6) {
        return Promise.reject('Mã xác nhận phải có 6 ký tự');
    }
    return Promise.resolve();
};

function Register({ setModule }) {
    const [isSendOtp, setIsSendOtp] = useState(false);
    const [loadingSendOtp, setLoadingSendOtp] = useState(false);
    const [form] = Form.useForm();
    const { configs } = useSelector((state) => state.apps);

    // Lấy dữ liệu từ form
    const otp = Form.useWatch('otp', form);
    const email = Form.useWatch('email', form);
    const password = Form.useWatch('password', form);
    const fullName = Form.useWatch('full_name', form);

    // Kiểm tra lỗi của các field
    const [hasErrors, setHasErrors] = useState(true);

    useEffect(() => {
        const checkValidation = async () => {
            try {
                await form.validateFields(['full_name', 'email', 'password']);
                setHasErrors(false);
            } catch {
                setHasErrors(true);
            }
        };
        checkValidation();
    }, [fullName, email, password, form]);

    // Điều kiện kích hoạt nút Gửi mã
    const isSendOtpDisabled = hasErrors || loadingSendOtp || isSendOtp;

    // Điều kiện kích hoạt nút Đăng ký
    const isRegisterDisabled = hasErrors || !otp;

    const handleSendOtpVerifyEmail = async () => {
        setLoadingSendOtp(true);
        const result = await requestUserSendCodeVerifyEmailRegister(email);

        setLoadingSendOtp(false);
        if (result?.status === 200) {
            setIsSendOtp(true);
            notification.success({ message: 'Thông báo', description: result.message });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleRegisterUser = async (values) => {
        const { full_name, email, ...other } = values;

        const fullName = full_name.trim();
        const nameParts = fullName.split(/\s+/);
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ');

        const data = {
            first_name,
            last_name,
            email: email.toLowerCase(),
            ...other,
        };

        const result = await requestUserRegister(data);

        if (result?.status === 200) {
            setModule('login');
            notification.success({ message: 'Thông báo', description: result.message });
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

                <h3 className="my-2 font-bold font-size-30">Đăng ký tài khoản</h3>

                <p className="mb-6 text-center">Nhập thông tin chi tiết của bạn bên dưới để tạo tài khoản và bắt đầu trải nghiệm.</p>
            </div>

            <div className="form_account-form">
                <Form form={form} name="horizontal_login" onFinish={handleRegisterUser} initialValues={{ phone_number: '' }}>
                    <Form.Item
                        name="full_name"
                        rules={[
                            {
                                validator: validateFullName,
                            },
                            {
                                pattern:
                                    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơưĂĨŨƠưĂỊỸƠỚỐỨỀễếệọẠảấầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý\s]+$/,
                                message: 'Họ và tên không hợp lệ',
                            },
                        ]}
                    >
                        <Input size="large" prefix={<IconUser />} placeholder="Họ và tên*" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email',
                            },
                            {
                                type: 'email',
                                message: 'Email không đúng định dạng',
                            },
                        ]}
                    >
                        <Input size="large" prefix={<IconMail />} placeholder="Email*" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu',
                            },
                            {
                                pattern: /^\S{6,30}$/,
                                message: 'Mật khẩu không hợp lệ',
                            },
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<IconLock />}
                            placeholder="Mật khẩu*"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item name="otp" className="mt-6" rules={[{ validator: validateOtp }]}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input size="large" placeholder="Mã xác nhận" disabled={!isSendOtp} />
                            <Button
                                size="large"
                                className="box-center"
                                type="primary"
                                onClick={handleSendOtpVerifyEmail}
                                disabled={isSendOtpDisabled}
                                loading={loadingSendOtp}
                            >
                                Gửi mã
                            </Button>
                        </Space.Compact>
                    </Form.Item>

                    <Form.Item shouldUpdate>
                        {() => (
                            <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }} disabled={isRegisterDisabled}>
                                ĐĂNG KÝ
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </div>

            <div className="text-center mt-4">
                Bạn đã có tài khoản?{' '}
                <span className="text-info cursor-pointer" onClick={() => setModule('login')}>
                    Đăng nhập
                </span>
            </div>
            <div className="mt-6 w-max-500 w-full">
                <div className="link-color text-center font-size-14">
                    Bằng việc nhấn nút ĐĂNG KÝ, Bạn đã đồng ý với{' '}
                    <Link target="_blank" to={router.terms}>
                        điều khoản sử dụng dịch vụ{' '}
                    </Link>
                    và{' '}
                    <Link target="_blank" to={router.privacy}>
                        chính sách bảo mật{' '}
                    </Link>
                    của chúng tôi.
                </div>
            </div>
        </Fragment>
    );
}

export default Register;
