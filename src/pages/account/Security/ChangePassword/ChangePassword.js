import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Flex, Form, Input, message, notification, Row } from 'antd';
import { IconArrowBackUp, IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';

import Account from '../../Account';
import router from '~/configs/routes';
import { generateRandomPassword } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserChangePassword } from '~/services/account';

function ChangePassword() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Netcode.vn - Thay đổi mật khẩu';

        if (!currentUser) {
            navigate(router.home);
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const handleChangePassword = async (values) => {
        const result = await requestUserChangePassword(values);

        if (result.status === 401 || result.status === 403 || result.status === 200) {
            dispatch(logoutUserSuccess());
            navigate(router.home);

            notification.success({
                message: 'Thông báo',
                description: 'Đổi mật khẩu thành công quý khách vui lòng đăng nhập lại',
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <Account>
            <div className="w-full">
                <div className="d-flex gap-3 border-bottom pb-2 mb-4">
                    <Button
                        className="box-center mt-1"
                        size="small"
                        onClick={() => navigate(router.security)}
                        style={{ width: 32, height: 32 }}
                    >
                        <IconArrowBackUp size={20} />
                    </Button>

                    <div className="flex-1">
                        <h3 className="font-bold font-size-20 mb-0">Thay đổi mật khẩu</h3>
                        <p className="text-subtitle mb-0">
                            Mật khẩu của bạn cần chứa ít nhất một chữ hoa, một chữ thường, một số và một số ký tự đặc biệt. Điều này giúp
                            tăng cường độ bảo mật và đảm bảo mật khẩu của bạn khó bị đoán trái phép.
                        </p>
                    </div>
                </div>

                <Form layout="vertical" form={form} onFinish={handleChangePassword}>
                    <Row>
                        <Col md={12} xs={24}>
                            <Form.Item
                                label="Mật khẩu hiện tại"
                                name="current_password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu hiện tại',
                                    },
                                    {
                                        pattern: /^\S{6,30}$/,
                                        message: 'Mật khẩu không hợp lệ',
                                    },
                                ]}
                            >
                                <Input.Password size="large" placeholder="Mật khẩu hiện tại" />
                            </Form.Item>
                            <Form.Item
                                label="Mật khẩu mới"
                                name="new_password"
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
                                label="Nhập lại mật khẩu mới"
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
                        </Col>
                    </Row>

                    <Flex className="gap-2 mt-2 xs-justify-space-between">
                        <Button size="large" className="box-center" onClick={handleGeneratePassword}>
                            <IconRefresh size={20} />
                            <span className="ml-2">Tạo mật khẩu</span>
                        </Button>
                        <Button size="large" type="primary" htmlType="submit" className="box-center">
                            <IconDeviceFloppy size={20} />
                            <span className="ml-2">Thay đổi</span>
                        </Button>
                    </Flex>
                </Form>
            </div>
        </Account>
    );
}

export default ChangePassword;
