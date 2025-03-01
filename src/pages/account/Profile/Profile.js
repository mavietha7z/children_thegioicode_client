import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vi from 'antd/es/date-picker/locale/vi_VN';
import { useDispatch, useSelector } from 'react-redux';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IconCameraFilled, IconDeviceFloppy } from '@tabler/icons-react';
import { Avatar, Button, Card, Col, DatePicker, Flex, Form, Input, Radio, Row, Select, notification } from 'antd';

import Account from '../Account';
import router from '~/configs/routes';
import { optionsProvinces } from '~/configs/province';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserUploadImage } from '~/services/image';
import { requestUserUpdateProfile } from '~/services/account';
import imageAvatarDefault from '~/assets/image/avatar-default.png';
import { validateFullName } from '~/layouts/components/Account/Register/validate';

dayjs.extend(customParseFormat);

const buddhistLocale = {
    ...vi,
    lang: {
        ...vi.lang,
        fieldDateFormat: 'DD/MM/YYYY',
    },
};

function Profile() {
    const [avatarUrl, setAvatarUrl] = useState('');

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Netcode.vn - Thông tin tài khoản';

        if (!currentUser) {
            navigate(router.home);
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        }

        const { full_name, phone_number, birthday, location, gender, avatar_url } = currentUser;

        if (gender) {
            form.setFieldValue('gender', gender);
        }
        if (birthday) {
            form.setFieldValue('birthday', dayjs(birthday));
        }

        setAvatarUrl(avatar_url);
        form.setFieldValue('city', location.city);
        form.setFieldValue('full_name', full_name);
        form.setFieldValue('address', location.address);
        form.setFieldValue('country', location.country);
        form.setFieldValue('phone_number', phone_number);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateUser = async (values) => {
        const data = {
            avatar_url: avatarUrl,
            ...values,
        };

        const result = await requestUserUpdateProfile(data);

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

    const handleChangeAvatar = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        const result = await requestUserUploadImage(formData);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setAvatarUrl(result.data);
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
                <h3 className="font-bold font-size-20 border-bottom pb-2 mb-5">Thông tin cá nhân</h3>

                <Form layout="vertical" form={form} onFinish={handleUpdateUser}>
                    <Card title={<h2 className="font-size-18 font-semibold mb-0 white-space-break">Thông tin cơ bản</h2>}>
                        <Row style={{ margin: '0 -10px', rowGap: 20, marginBottom: 20 }}>
                            <Col span={24} style={{ padding: '0 10px' }}>
                                <Flex align="center" className="gap-5">
                                    <div>Ảnh đại diện</div>
                                    <div className="box_avatar">
                                        <Avatar
                                            src={avatarUrl || imageAvatarDefault}
                                            style={{ width: 100, height: 100, lineHeight: 100 }}
                                        />
                                        <label className="btn_edit_avatar">
                                            <IconCameraFilled size={18} />

                                            <Input
                                                type="file"
                                                accept="image/png, image/jpg, image/jpeg"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleChangeAvatar(e)}
                                            />
                                        </label>
                                    </div>
                                </Flex>
                            </Col>
                            <Col md={12} xs={24} style={{ padding: '0 10px' }}>
                                <Form.Item
                                    className="mb-0"
                                    name="full_name"
                                    label="Họ tên"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ tên',
                                        },
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
                                    <Input size="large" placeholder="Họ tên" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24} style={{ padding: '0 10px' }}>
                                <Form.Item
                                    className="mb-0"
                                    name="phone_number"
                                    label="Điện thoại"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại',
                                        },
                                        {
                                            pattern: /^0[0-9]{9}$/,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder="Số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24} style={{ padding: '0 10px' }}>
                                <Form.Item
                                    className="mb-0"
                                    name="birthday"
                                    label="Ngày sinh"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày sinh',
                                        },
                                    ]}
                                >
                                    <DatePicker locale={buddhistLocale} size="large" style={{ width: '100%' }} placeholder="Ngày sinh" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24} style={{ padding: '0 10px' }}>
                                <Form.Item
                                    className="mb-0"
                                    name="country"
                                    label="Quốc gia"
                                    rules={[{ required: true, message: 'Vui lòng chọn quốc gia' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Quốc gia"
                                        options={[
                                            {
                                                value: 'VN',
                                                label: 'Việt Nam',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24} style={{ padding: '0 10px' }}>
                                <Form.Item
                                    className="mb-0"
                                    name="city"
                                    label="Thành phố"
                                    rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
                                >
                                    <Select
                                        showSearch
                                        size="large"
                                        placeholder="Thành phố"
                                        optionFilterProp="label"
                                        options={optionsProvinces}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24} style={{ padding: '0 10px' }}>
                                <Form.Item
                                    className="mb-0"
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input size="large" placeholder="Địa chỉ" />
                                </Form.Item>
                            </Col>
                            <Col md={12} style={{ padding: '0 10px' }}>
                                <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                                    <Radio.Group>
                                        <Radio value="male">Nam</Radio>
                                        <Radio value="female">Nữ</Radio>
                                        <Radio value="other">Khác</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Flex className="mt-5 gap-2" align="center">
                            <Button size="large" type="primary" htmlType="submit" className="box-center">
                                <IconDeviceFloppy size={20} />
                                <span className="ml-1">Cập nhật</span>
                            </Button>
                        </Flex>
                    </Card>
                </Form>
            </div>
        </Account>
    );
}

export default Profile;
