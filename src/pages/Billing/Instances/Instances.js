import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    IconDots,
    IconEdit,
    IconLock,
    IconPower,
    IconCancel,
    IconResize,
    IconRotate,
    IconServer2,
    IconSettings,
    IconDeviceFloppy,
} from '@tabler/icons-react';
import {
    Row,
    Col,
    Form,
    Card,
    Flex,
    Spin,
    Input,
    Empty,
    Modal,
    Space,
    Table,
    Switch,
    Avatar,
    Button,
    Tooltip,
    message,
    Dropdown,
    Pagination,
    notification,
} from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { calculateDaysLeft } from '~/configs';
import IconBalance from '~/assets/icon/IconBalance';
import IconLoading from '~/assets/icon/IconLoading';
import { requestUserAddProductToCart } from '~/services/cart';
import imageAvatarDefault from '~/assets/image/avatar-default.png';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserActionInstance, requestUserGetOrderInstances, requestUserRenameInstance } from '~/services/billing';

function Instances() {
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [instance, setInstance] = useState(null);
    const [instances, setInstances] = useState([]);
    const [openRename, setOpenRename] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const [action, setAction] = useState(null);
    const [instanceId, setInstanceId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Netcode.vn - Máy chủ đã tạo';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetOrderInstances(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setInstances(result.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Auto Renew
    const handleAutoReNewInstance = async (id) => {
        if (!id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Lỗi lấy ID máy chủ để gia hạn',
            });
        }

        const result = await requestUserActionInstance('auto-renew', id);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const cloneInstances = [...instances];

            const instanceIndex = cloneInstances.findIndex((item) => item.id === id);
            if (instanceIndex === -1) {
                return notification.error({
                    message: 'Thông báo',
                    description: 'Không tìm thấy máy chủ trong danh sách',
                });
            }

            cloneInstances[instanceIndex].auto_renew = result.data;
            setInstances(cloneInstances);

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

    // Action
    const handleActionInstance = async () => {
        if (!instanceId) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn máy chủ muốn thao tác',
            });
        }
        if (!action) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn thao tác với máy chủ',
            });
        }

        setLoadingAction(true);

        const result = await requestUserActionInstance(action, instanceId);

        setLoadingAction(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const cloneInstances = [...instances];

            const instanceIndex = cloneInstances.findIndex((item) => item.id === instanceId);
            if (instanceIndex === -1) {
                return notification.error({
                    message: 'Thông báo',
                    description: 'Không tìm thấy máy chủ trong danh sách',
                });
            }

            if (action === 'stop') {
                cloneInstances[instanceIndex].status = 'stopping';
            }
            if (action === 'start' || action === 'restart') {
                cloneInstances[instanceIndex].status = 'restarting';
            }

            // Cập nhật trạng thái tạm thời
            if (action === 'stop') {
                cloneInstances[instanceIndex].status = 'stopping';
                setInstances(cloneInstances);

                // Sau 10 giây, chuyển trạng thái thành "stopped"
                setTimeout(() => {
                    const updatedInstances = [...cloneInstances];
                    updatedInstances[instanceIndex].status = 'stopped';
                    setInstances(updatedInstances);
                }, 12000);
            }
            if (action === 'restart' || action === 'start') {
                cloneInstances[instanceIndex].status = 'restarting';
                setInstances(cloneInstances);

                // Sau 10 giây, chuyển trạng thái thành "activated"
                setTimeout(() => {
                    const updatedInstances = [...cloneInstances];
                    updatedInstances[instanceIndex].status = 'activated';
                    setInstances(updatedInstances);
                }, 12000);
            }

            setAction(null);
            setInstanceId(null);
            setModalVisible(false);

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

    // Renew
    const handleRenewOrderInstance = async (id) => {
        if (!id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn máy chủ để gia hạn',
            });
        }

        const result = await requestUserAddProductToCart('order-instance', { id });

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const { cart_count, ...others } = currentUser;
            dispatch(loginUserSuccess({ cart_count: cart_count + 1, ...others }));

            navigate(router.cart);
            message.success(result.message);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    // Rename
    const handleRenameInstance = async (values) => {
        if (!instance.id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn máy chủ để đổi tên',
            });
        }
        if (values.display_name === instance.display_name) {
            return notification.error({
                message: 'Thông báo',
                description: 'Tên hiển thị không được giống tên cũ',
            });
        }

        const data = {
            instance_id: instance.id,
            display_name: values.display_name,
        };

        const result = await requestUserRenameInstance(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const cloneInstances = [...instances];

            const instanceIndex = cloneInstances.findIndex((item) => item.id === instance.id);
            if (instanceIndex === -1) {
                return notification.error({
                    message: 'Thông báo',
                    description: 'Không tìm thấy máy chủ trong danh sách',
                });
            }
            cloneInstances[instanceIndex].display_name = values.display_name;
            setInstances(cloneInstances);

            setInstance(null);
            setOpenRename(false);
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (index) => <b>{index}</b>,
        },
        {
            title: 'Tên máy chủ',
            key: 'name',
            render: (data) => (
                <Flex align="center">
                    <div className="mr-3">
                        <Avatar
                            src={data.image.image_url || imageAvatarDefault}
                            style={{ width: 30, height: 30, lineHeight: 30, fontSize: 18 }}
                            alt="Image"
                            className="border"
                        />
                    </div>
                    <div>
                        <div className="d-flex align-items-start">
                            <Link to={`${router.billing_instances}/${data.id}`} className="hover-underline">
                                {data.display_name}
                            </Link>
                            <IconEdit
                                size={16}
                                className="cursor-pointer text-subtitle hover-blue ml-1 mt-2px"
                                onClick={() => {
                                    setInstance(data);
                                    setOpenRename(true);
                                    form.setFieldValue('display_name', data.display_name);
                                }}
                            />
                        </div>
                        <div className="font-size-13">
                            {data.product.core}-{data.product.memory / 1024}-{data.product.disk}
                        </div>
                        <div className="font-size-13">
                            {data.image.title} - {data.order_info.access_ipv4}
                        </div>
                    </div>
                </Flex>
            ),
        },
        {
            title: 'Máy chủ',
            key: 'region',
            render: (data) => (
                <Fragment>
                    <span>{data.plan.title}</span>
                    <br />
                    <span>{data.region.title}</span>
                </Fragment>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let style = {};
                let className = '';

                if (status === 'activated') {
                    className = 'label-light-success font-weight-bold';
                    style = { backgroundColor: '#4caf501a', color: '#4caf50', border: '1px solid #4caf501a' };
                }
                if (['starting', 'restarting', 'stopping', 'rebuilding', 'resizing'].includes(status)) {
                    className = 'label-light-warning font-weight-bold';
                    style = { backgroundColor: '#ff98001a', color: '#ff9800', border: '1px solid #ff98001a' };
                }
                if (['stopped', 'suspended', 'expired', 'deleted'].includes(status)) {
                    className = 'label-light-danger font-weight-bold';
                    style = { backgroundColor: '#f443361a', color: '#f44336', border: '1px solid #f443361a' };
                }

                return (
                    <Fragment>
                        {['starting', 'restarting', 'stopping', 'rebuilding', 'resizing'].includes(status) ? (
                            <Flex align="center">
                                <div className={className} style={style}>
                                    {status.toUpperCase()}
                                </div>
                                <IconLoading />
                            </Flex>
                        ) : (
                            <div className={className} style={style}>
                                {status.toUpperCase()}
                            </div>
                        )}
                    </Fragment>
                );
            },
        },
        {
            title: 'Tự động gia hạn',
            key: 'auto_renew',
            render: (data) => (
                <Switch
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    value={data.auto_renew}
                    onChange={() => handleAutoReNewInstance(data.id)}
                    disabled={data.status === 'deleted' || data.status === 'expired'}
                />
            ),
        },
        {
            title: 'Ngày tạo/Hết hạn',
            key: 'date',
            render: (data) => (
                <Fragment>
                    <span>{moment(data.created_at).format('DD/MM/YYYY HH:mm')}</span>
                    <br />
                    <span>{moment(data.expired_at).format('DD/MM/YYYY HH:mm')}</span>
                    <br />
                    <Fragment>
                        (
                        <b className={moment(data.expired_at).diff(new Date(), 'days') < 8 ? 'text-danger' : ''}>
                            {calculateDaysLeft(data.expired_at)}
                        </b>
                        )
                    </Fragment>
                </Fragment>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (data) => {
                const items = [
                    {
                        label: <div onClick={() => handleRenewOrderInstance(data.id)}>Gia hạn</div>,
                        key: '0',
                        icon: <IconBalance width={20} height={20} />,
                    },
                ];

                if (data.status !== 'expired' && data.status !== 'deleted') {
                    items.push(
                        {
                            label: <Link to={`${router.billing_instances}/${data.id}/rebuild`}>Cài lại Image</Link>,
                            key: '1',
                            icon: <IconSettings size={20} />,
                        },
                        {
                            label: <Link to={`${router.billing_instances}/${data.id}/resize`}>Thay đổi cấu hình</Link>,
                            key: '2',
                            icon: <IconResize width={20} height={20} />,
                        },
                        {
                            label: <div>Thay đổi mật khẩu</div>,
                            key: '3',
                            icon: <IconLock width={20} height={20} />,
                        },
                    );
                }

                return (
                    <Space>
                        {data.status !== 'expired' && data.status !== 'deleted' && (
                            <Tooltip title={data.status !== 'stopped' ? 'Tắt' : 'Bật'}>
                                <Button
                                    className="box-center button-action-instance"
                                    size="small"
                                    onClick={() => {
                                        setAction(data.status !== 'stopped' ? 'stop' : 'start');
                                        setInstanceId(data.id);
                                        setModalVisible(true);
                                    }}
                                >
                                    <IconPower width={18} height={18} />
                                </Button>
                            </Tooltip>
                        )}

                        {data.status === 'activated' && (
                            <Tooltip title="Khởi động lại">
                                <Button
                                    className="box-center button-action-instance"
                                    size="small"
                                    onClick={() => {
                                        setAction('restart');
                                        setInstanceId(data.id);
                                        setModalVisible(true);
                                    }}
                                >
                                    <IconRotate width={18} height={18} />
                                </Button>
                            </Tooltip>
                        )}

                        {data.status !== 'deleted' && (
                            <Tooltip title="Chức năng khác">
                                <Dropdown placement="bottomRight" menu={{ items }} trigger={['click']}>
                                    <Button className="box-center button-action-instance" size="small">
                                        <IconDots width={18} height={18} />
                                    </Button>
                                </Dropdown>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Billing
            keyTab="6"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconServer2 size={20} />
                    Instances
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                    <Spin />
                </Flex>
            ) : instances.length > 0 ? (
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={instances.map((template, index) => ({ key: index, ...template }))}
                        pagination={false}
                    />
                </Card>
            ) : (
                <Flex justify="center" align="center" style={{ minHeight: 'calc(-260px + 100vh)' }}>
                    <Empty description={<p className="text-subtitle">Không có dữ liệu máy chủ đã tạo</p>} />
                </Flex>
            )}

            {Number(pages) > 1 && (
                <Flex justify="end" style={{ margin: '20px 0 10px 0' }}>
                    <Pagination
                        current={page || 1}
                        pageSize={20}
                        total={Number(pages) * 20}
                        onChange={(page) => {
                            setPage(page);
                            setSearchParams({ page });
                        }}
                    />
                </Flex>
            )}

            {modalVisible && (
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    open={modalVisible}
                    onOk={handleActionInstance}
                    onCancel={() => setModalVisible(false)}
                    width={400}
                    okText={<Fragment>{loadingAction ? <Spin size="small" /> : 'Xác nhận'}</Fragment>}
                    cancelText="Hủy"
                    okButtonProps={{ disabled: loadingAction }}
                    cancelButtonProps={{ disabled: loadingAction }}
                    title={action.charAt(0).toUpperCase() + action.slice(1)}
                >
                    <p>Bạn có muốn {action.charAt(0).toUpperCase() + action.slice(1)} máy chủ không?</p>
                </Modal>
            )}

            {openRename && (
                <Modal
                    centered
                    closable={false}
                    maskClosable={false}
                    open={openRename}
                    onCancel={() => setOpenRename(false)}
                    width={460}
                    title="Thay đổi tên"
                    footer={null}
                >
                    <Form layout="vertical" form={form} onFinish={handleRenameInstance}>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    name="display_name"
                                    label="Tên Máy chủ"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên máy chủ',
                                        },
                                    ]}
                                >
                                    <Input size="large" placeholder="Tên máy chủ" className="w-full" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 flex-grow-1">
                            <Button
                                icon={<IconCancel size={18} />}
                                className="box-center"
                                size="large"
                                onClick={() => setOpenRename(false)}
                            >
                                Huỷ
                            </Button>
                            <Button
                                type="primary"
                                icon={<IconDeviceFloppy size={20} />}
                                className="box-center flex-1"
                                htmlType="submit"
                                size="large"
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Billing>
    );
}

export default Instances;
