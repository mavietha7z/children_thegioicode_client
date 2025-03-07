import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconCpu,
    IconCopy,
    IconDots,
    IconPower,
    IconResize,
    IconNetwork,
    IconRefresh,
    IconActivity,
    IconSettings,
    IconArrowLeft,
    IconCalendarPlus,
    IconCurrencyDollar,
} from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Breadcrumb, Button, Card, Col, Dropdown, Flex, Modal, Row, Spin, Switch, Tooltip, message, notification } from 'antd';

import router from '~/configs/routes';
import IconBalance from '~/assets/icon/IconBalance';
import IconLoading from '~/assets/icon/IconLoading';
import { requestUserAddProductToCart } from '~/services/cart';
import imageAvatarDefault from '~/assets/image/avatar-default.png';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { calculateDaysLeft, convertCurrency, serviceCopyKeyBoard } from '~/configs';
import { requestUserActionInstance, requestUserGetInstanceDetail } from '~/services/billing';

function InstanceDetail() {
    const [loading, setLoading] = useState(true);
    const [instance, setInstance] = useState(null);

    const [action, setAction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { instance_id } = useParams();
    const currentUser = useSelector((state) => state.auth);

    useEffect(() => {
        if (instance_id) {
            document.title = `Netcode.vn - #${instance_id}`;

            const fetch = async () => {
                const result = await requestUserGetInstanceDetail(instance_id);

                setLoading(false);
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(router.home);
                    notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
                } else if (result.status === 200) {
                    setInstance(result.data);
                } else {
                    navigate(router.billing_instances);
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
            };
            fetch();
        } else {
            navigate(router.billing_instances);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance_id]);

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

    // Action
    const handleActionInstance = async () => {
        if (!action) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn thao tác với máy chủ',
            });
        }

        setLoadingAction(true);

        const result = await requestUserActionInstance(action, instance_id);

        setLoadingAction(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            if (action === 'stop') {
                instance.status = 'stopping';
            }
            if (action === 'start' || action === 'restart') {
                instance.status = 'restarting';
            }
            if (action === 'auto-renew') {
                instance.auto_renew = !instance.auto_renew;
            }

            // Cập nhật trạng thái tạm thời
            if (action === 'stop') {
                instance.status = 'stopping';
                setInstance(instance);

                // Sau 10 giây, chuyển trạng thái thành "stopped"
                setTimeout(() => {
                    instance.status = 'stopped';
                    setInstance(instance);
                }, 12000);
            }
            if (action === 'restart' || action === 'start') {
                instance.status = 'restarting';
                setInstance(instance);

                // Sau 10 giây, chuyển trạng thái thành "activated"
                setTimeout(() => {
                    instance.status = 'activated';
                    setInstance(instance);
                }, 12000);
            }

            setAction(null);
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

    const items = [
        {
            label: <div onClick={() => handleRenewOrderInstance(instance_id)}>Gia hạn</div>,
            key: '0',
            icon: <IconBalance width={20} height={20} />,
        },
        {
            label: <Link to={`${router.billing_instances}/${instance_id}/rebuild`}>Cài lại Image</Link>,
            key: '1',
            icon: <IconSettings size={20} />,
        },
        {
            label: <Link to={`${router.billing_instances}/${instance_id}/resize`}>Thay đổi cấu hình</Link>,
            key: '2',
            icon: <IconResize width={20} height={20} />,
        },
    ];

    let className = '';
    if (instance?.status === 'activated') {
        className = 'text-primary';
    }
    if (['starting', 'stopping', 'restarting', 'rebuilding', 'resizing'].includes(instance?.status)) {
        className = 'text-warning';
    }
    if (['stopped', 'suspended', 'expired', 'deleted'].includes(instance?.status)) {
        className = 'text-danger';
    }

    return (
        <div className="container">
            <Row>
                <Col span={24}>
                    <Flex className="gap-2 mb-3 ml-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.billing_instances)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.billing_instances}>Instances</Link>,
                                },
                                {
                                    title: `#${instance_id}`,
                                },
                            ]}
                        />
                    </Flex>
                </Col>

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

                {!loading && instance ? (
                    <Col span={24}>
                        <Row style={{ rowGap: 16 }}>
                            <Col span={24} style={{ padding: '0 8px' }}>
                                <Card styles={{ body: { adding: '18px 18px 0' } }}>
                                    <div className="d-flex justify-content-between gap-2">
                                        <Avatar
                                            src={instance.image.image_url || imageAvatarDefault}
                                            style={{ width: 50, height: 50, lineHeight: 50, fontSize: 18 }}
                                            alt="Image"
                                            className="border"
                                        />
                                        <div className="flex-1 d-flex justify-content-between flex-wrap row-gap-2">
                                            <div>
                                                <h3 className="mb-0 font-size-18 font-bold">{instance.display_name}</h3>
                                                <div className="d-flex flex-wrap gap-4 row-gap-1 font-size-13 mt-2px">
                                                    <div className="d-flex text-subtitle text-normal gap-1">
                                                        <span className="anticon cursor-pointer text-primary">
                                                            <IconCalendarPlus size={14} />
                                                        </span>

                                                        {moment(instance.created_at).format('DD/MM/YYYY HH:mm:ss')}
                                                    </div>
                                                    <div
                                                        className="d-flex text-subtitle text-normal hover-bg-gray gap-1 cursor-pointer"
                                                        onClick={() => serviceCopyKeyBoard(instance.order_info.access_ipv4)}
                                                    >
                                                        <span className="anticon cursor-pointer text-primary">
                                                            <IconNetwork size={14} />
                                                        </span>

                                                        {instance.order_info.access_ipv4}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end flex-wrap gap-1-5">
                                                {instance.status !== 'expired' && instance.status !== 'deleted' && (
                                                    <Tooltip title={instance.status !== 'stopped' ? 'Tắt' : 'Bật'}>
                                                        <Button
                                                            className="box-center button-action-instance"
                                                            onClick={() => {
                                                                setAction(instance.status !== 'stopped' ? 'stop' : 'start');
                                                                setModalVisible(true);
                                                            }}
                                                        >
                                                            <IconPower width={20} height={20} />
                                                        </Button>
                                                    </Tooltip>
                                                )}

                                                {instance.status === 'activated' && (
                                                    <Tooltip title="Khởi động lại">
                                                        <Button
                                                            className="box-center button-action-instance"
                                                            onClick={() => {
                                                                setAction('restart');
                                                                setModalVisible(true);
                                                            }}
                                                        >
                                                            <IconRefresh width={20} height={20} />
                                                        </Button>
                                                    </Tooltip>
                                                )}

                                                {instance.status !== 'deleted' && (
                                                    <Tooltip title="Chức năng khác">
                                                        <Dropdown placement="bottomRight" menu={{ items }} trigger={['click']}>
                                                            <Button className="box-center button-action-instance" size="small">
                                                                <IconDots width={18} height={18} />
                                                            </Button>
                                                        </Dropdown>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            <Col md={24} xs={24} style={{ padding: '0 8px' }}>
                                <Row style={{ margin: '0px -8px' }}>
                                    <Col style={{ padding: '0px 8px' }} md={8} xs={24}>
                                        <Card styles={{ body: { padding: '18px 18px 15px' } }}>
                                            <div className="d-flex align-items-center gap-4">
                                                <Avatar
                                                    shape="square"
                                                    className="box-center"
                                                    icon={<IconCpu size={25} />}
                                                    style={{ width: 40, height: 40, lineHeight: 40, fontSize: 20 }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold font-size-15 text-subtitle">Bandwidth Usage</div>
                                                    <div className="font-bold font-size-25 text-primary">
                                                        {instance.product.bandwidth > 0 ? instance.bandwidth_usage : '0'} B
                                                        <span className="font-normal text-subtitle font-size-14">
                                                            {' '}
                                                            /{' '}
                                                            {instance.product.bandwidth === 0
                                                                ? 'Unlimited'
                                                                : `${instance.product.bandwidth} B`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col style={{ padding: '0px 8px' }} md={8} xs={24}>
                                        <Card styles={{ body: { padding: '18px 18px 15px' } }}>
                                            <div className="d-flex align-items-center gap-4">
                                                <Avatar
                                                    shape="square"
                                                    className="box-center"
                                                    icon={<IconActivity size={25} />}
                                                    style={{ width: 40, height: 40, lineHeight: 40, fontSize: 20 }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold font-size-15 text-subtitle">CPU Usage</div>
                                                    <div className="font-bold font-size-25 text-primary">{instance.cpu_usage} %</div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col style={{ padding: '0px 8px' }} md={8} xs={24}>
                                        <Card styles={{ body: { padding: '18px 18px 15px' } }}>
                                            <div className="d-flex align-items-center gap-4">
                                                <Avatar
                                                    shape="square"
                                                    className="box-center"
                                                    icon={<IconCurrencyDollar size={25} />}
                                                    style={{ width: 40, height: 40, lineHeight: 40, fontSize: 20 }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-bold font-size-15 text-subtitle">Current Charges</div>
                                                    <div className="font-bold font-size-25 text-primary">
                                                        {convertCurrency(instance.override_price)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={24} xs={24} style={{ padding: '0 8px' }}>
                                <Card
                                    styles={{ header: { paddingInline: 18, paddingBlock: 5, minHeight: 52 }, body: { padding: 18 } }}
                                    title={<div className="font-size-18 font-bold mb-0 white-space-break">Thông tin cơ bản</div>}
                                >
                                    <Row style={{ margin: '0px -12px', rowGap: 18 }}>
                                        <Col md={8} xs={24} style={{ padding: '0px 12px' }}>
                                            <div className="d-flex flex-column gap-4">
                                                <div>
                                                    <div className="text-black">IPv4</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {instance.order_info.access_ipv4}
                                                        <span
                                                            className="anticon cursor-pointer text-subtitle hover-blue ml-1"
                                                            onClick={() => serviceCopyKeyBoard(instance.order_info.access_ipv4)}
                                                        >
                                                            <IconCopy size={14} stroke={2} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Username</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {instance.order_info.username}
                                                        <span
                                                            className="anticon cursor-pointer text-subtitle hover-blue ml-1"
                                                            onClick={() => serviceCopyKeyBoard(instance.order_info.username)}
                                                        >
                                                            <IconCopy size={14} stroke={2} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Password</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {instance.order_info.password}
                                                        <span
                                                            className="anticon cursor-pointer text-subtitle hover-blue ml-1"
                                                            onClick={() => serviceCopyKeyBoard(instance.order_info.password)}
                                                        >
                                                            <IconCopy size={14} stroke={2} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Port</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {instance.order_info.port}
                                                        <span
                                                            className="anticon cursor-pointer text-subtitle hover-blue ml-1"
                                                            onClick={() => serviceCopyKeyBoard(instance.order_info.port)}
                                                        >
                                                            <IconCopy size={14} stroke={2} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={8} xs={24} style={{ padding: '0px 12px' }}>
                                            <div className="d-flex flex-column gap-4">
                                                <div>
                                                    <div className="text-black">Vị trí</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">{instance.region.title}</div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Plan</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">{instance.plan.title}</div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Cấu hình</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {instance.product.core} vCPU | {instance.product.memory / 1024} GB RAM |{' '}
                                                        {instance.product.disk} GB SSD
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Hết hạn ngày</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {moment(instance.expired_at).format('DD/MM/YYYY HH:mm')}

                                                        <span className="ml-1">
                                                            (
                                                            <b
                                                                className={
                                                                    moment(instance.expired_at).diff(new Date(), 'days') < 8
                                                                        ? 'text-danger'
                                                                        : ''
                                                                }
                                                            >
                                                                {calculateDaysLeft(instance.expired_at)}
                                                            </b>
                                                            )
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md={8} xs={24} style={{ padding: '0px 12px' }}>
                                            <div className="d-flex flex-column gap-4">
                                                <div>
                                                    <div className="text-black">Trạng thái</div>
                                                    <div className="text-info font-bold text-uppercase">
                                                        <Fragment>
                                                            {['starting', 'restarting', 'stopping', 'rebuilding', 'resizing'].includes(
                                                                instance.status,
                                                            ) ? (
                                                                <Flex align="center">
                                                                    <div className={className}>{instance.status.toUpperCase()}</div>
                                                                    <IconLoading />
                                                                </Flex>
                                                            ) : (
                                                                <div className={className}>{instance.status.toUpperCase()}</div>
                                                            )}
                                                        </Fragment>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Image</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">{instance.image.title}</div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Tổng phí</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        {convertCurrency(instance.override_price)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-black">Tự động gia hạn</div>
                                                    <div className="flex-1 font-bold break-all text-subtitle">
                                                        <Switch
                                                            checkedChildren="Bật"
                                                            unCheckedChildren="Tắt"
                                                            value={instance.auto_renew}
                                                            disabled={instance.status === 'deleted' || instance.status === 'expired'}
                                                            onClick={() => {
                                                                setAction('auto-renew');
                                                                setModalVisible(true);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                ) : (
                    <Flex align="center" justify="center" className="w-full" style={{ minHeight: '60vh' }}>
                        <Spin />
                    </Flex>
                )}
            </Row>
        </div>
    );
}

export default InstanceDetail;
