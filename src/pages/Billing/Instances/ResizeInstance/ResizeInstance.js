import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Avatar, Breadcrumb, Button, Card, Col, Flex, Modal, Row, Spin, notification } from 'antd';
import {
    IconCpu,
    IconWorld,
    IconChecks,
    IconNetwork,
    IconArrowLeft,
    IconShoppingBag,
    IconCalendarPlus,
    IconDeviceFloppy,
    IconDeviceSdCard,
    IconBrandSpeedtest,
} from '@tabler/icons-react';

import router from '~/configs/routes';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { convertCurrency, serviceCopyKeyBoard } from '~/configs';
import imageAvatarDefault from '~/assets/image/avatar-default.png';
import IconCheckMarkDefault from '~/assets/icon/IconCheckMarkDefault';
import { requestUserGetProductResizeInstance, requestUserResizeInstance } from '~/services/billing';

// Tính số ngày sử dụng còn lại
const calculateDaysLeftInstances = (expiredAt) => {
    const currentDate = new Date();
    const expireDate = new Date(expiredAt);

    const timeDifference = expireDate - currentDate;
    const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return remainingDays;
};

// Tính % thời còn lại trong tháng
function calculateRemainingRatio(remainingDays, daysInMonth) {
    // Tính tỷ lệ thời gian còn lại (kiểu 0,%)
    const remainingRatio = remainingDays / daysInMonth;

    // Làm tròn đến 4 chữ số thập phân (nếu cần)
    return parseFloat(remainingRatio.toFixed(2));
}

// Tổng ngày trong tháng
function getDaysInCurrentMonth() {
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Lấy năm và tháng hiện tại
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0 = tháng 1)

    // Tạo một ngày mới với tháng tiếp theo và ngày là 0
    // Điều này sẽ trả về ngày cuối cùng của tháng trước đó
    const lastDayOfMonth = new Date(year, month, 0);

    // Lấy số ngày trong tháng
    return lastDayOfMonth.getDate();
}

// Số tiền phải trả nếu nâng cấp
function calculateUpgradeCost(oldPrice, newPrice, remainingDays, daysInMonth) {
    // Tính giá trị còn lại của gói cũ
    const oldPackageValue = (oldPrice / daysInMonth) * remainingDays;

    // Tính giá trị của gói mới cho số ngày còn lại
    const newPackageValue = (newPrice / daysInMonth) * remainingDays;

    // Tính số tiền phải trả để nâng cấp
    const upgradeCost = newPackageValue - oldPackageValue;

    return Math.round(upgradeCost);
}

function ResizeInstance() {
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingRebuild, setLoadingRebuild] = useState(false);

    const [loading, setLoading] = useState(true);
    const [instance, setInstance] = useState(null);

    const [products, setProducts] = useState([]);
    const [productSelect, setProductSelect] = useState(null);
    const [activeProductId, setActiveProductId] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { instance_id } = useParams();

    useEffect(() => {
        if (instance_id) {
            document.title = `Thegioicode.com - #${instance_id}`;

            const fetch = async () => {
                const result = await requestUserGetProductResizeInstance(instance_id);

                setLoading(false);
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(router.home);
                    notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
                } else if (result.status === 200) {
                    setInstance(result.data.instance);
                    setProducts(result.data.products);

                    if (result.data.products.length > 0) {
                        const productSelect = result.data.products[0];
                        setProductSelect(productSelect);
                        setActiveProductId(productSelect.id);
                    }
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

    // Chọn gói
    const handleSelectProduct = (product) => {
        setProductSelect(product);
        setActiveProductId(product.id);
    };

    // Rebuild
    const handleResizeInstance = async () => {
        const data = {
            instance_id,
            product_id: productSelect.id,
        };

        setModalVisible(false);
        setLoadingRebuild(true);

        const result = await requestUserResizeInstance(data);

        setLoadingRebuild(false);
        if (result?.status === 401 || result?.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            navigate(router.billing_instances);

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
        <Row>
            <Col span={24}>
                <Flex className="gap-2 mb-3 ml-2">
                    <Button size="small" className="box-center" onClick={() => navigate(`${router.billing_instances}/${instance_id}`)}>
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
                                title: <Link to={`${router.billing_instances}/${instance_id}`}>{instance?.display_name}</Link>,
                            },
                            {
                                title: 'Resize',
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
                    onOk={handleResizeInstance}
                    onCancel={() => setModalVisible(false)}
                    width={460}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    title="Thay đổi cấu hình"
                >
                    <p>Bạn có muốn thay đổi cấu hình không?</p>
                </Modal>
            )}

            {!loading && instance ? (
                <Col span={24}>
                    <Row style={{ rowGap: 16 }}>
                        <Col span={19} style={{ padding: '0 8px' }}>
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

                                                    <span className="font-semibold text-info">{instance.status.toUpperCase()}</span>
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
                                    </div>
                                </div>

                                <Alert
                                    message="Lưu ý rằng máy chủ sẽ khởi động lại khi thực hiện thao tác thay đổi cấu hình"
                                    type="warning"
                                    showIcon
                                    className="mt-5"
                                />

                                <div className="mt-5">
                                    <b>Cấu hình hiện tại: </b>
                                    <span>
                                        {instance.product.core} vCPU / {instance.product.memory / 1024}GB RAM / {instance.product.disk}GB
                                        DISK
                                    </span>
                                </div>

                                <Row style={{ marginLeft: -8, marginRight: -8, marginTop: 40, rowGap: 16 }}>
                                    {products.map((product) => (
                                        <Col md={6} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }} key={product.id}>
                                            <div
                                                className="item-plan-instance flex-column align-items-center mr-0 mt-0"
                                                data-active={activeProductId === product.id}
                                                onClick={() => handleSelectProduct(product)}
                                            >
                                                <div className="title font-size-16 font-bold text-center mb-2">{product.title}</div>
                                                <div className="font-bold text-center">
                                                    <span className="font-size-23 text-primary">
                                                        {convertCurrency(product.pricing.price * (1 - product.pricing.discount / 100))}
                                                    </span>
                                                    <span className="text-subtitle font-size-13"> / Tháng</span>
                                                </div>

                                                <div className="border-top w-full mt-4">
                                                    <Flex
                                                        align="center"
                                                        justify="space-between"
                                                        className="border-bottom py-2 px-1 font-bold text-subtitle"
                                                    >
                                                        <div className="box-center">
                                                            <IconCpu size={20} />
                                                            <span className="ml-1">CPU</span>
                                                        </div>
                                                        <div>{product.core} vCPU</div>
                                                    </Flex>
                                                    <Flex
                                                        align="center"
                                                        justify="space-between"
                                                        className="border-bottom py-2 px-1 font-bold text-subtitle"
                                                    >
                                                        <div className="box-center">
                                                            <IconDeviceSdCard size={20} />
                                                            <span className="ml-1">RAM</span>
                                                        </div>
                                                        <div>{product.memory / 1024} GB</div>
                                                    </Flex>
                                                    <Flex
                                                        align="center"
                                                        justify="space-between"
                                                        className="border-bottom py-2 px-1 font-bold text-subtitle"
                                                    >
                                                        <div className="box-center">
                                                            <IconDeviceFloppy size={20} />
                                                            <span className="ml-1">DISK</span>
                                                        </div>
                                                        <div>{product.disk} GB</div>
                                                    </Flex>
                                                    <Flex
                                                        align="center"
                                                        justify="space-between"
                                                        className="border-bottom py-2 px-1 font-bold text-subtitle"
                                                    >
                                                        <div className="box-center">
                                                            <IconBrandSpeedtest size={20} />
                                                            <span className="ml-1">Network</span>
                                                        </div>
                                                        <div>{product.network_speed} Mbps</div>
                                                    </Flex>
                                                    <Flex
                                                        align="center"
                                                        justify="space-between"
                                                        className="border-bottom py-2 px-1 font-bold text-subtitle"
                                                    >
                                                        <div className="box-center">
                                                            <IconWorld size={20} />
                                                            <span className="ml-1">IPv4</span>
                                                        </div>
                                                        <div>1 Địa chỉ</div>
                                                    </Flex>
                                                </div>

                                                {activeProductId === product.id && <IconCheckMarkDefault />}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>

                        <Col md={5} xs={24} style={{ padding: '0 8px' }}>
                            <div className="cloud_server-right">
                                <Card
                                    style={{ height: '100%' }}
                                    styles={{ body: { padding: 0, height: 'calc(100% - 56px)' } }}
                                    title={
                                        <div className="d-flex align-items-center">
                                            <IconShoppingBag size={22} />
                                            <h2 className="font-size-17 mb-0 font-bold ml-2">Thông tin hóa đơn</h2>
                                        </div>
                                    }
                                >
                                    <div className="cloud_server-container border-top">
                                        <div className="cloud_server-content pt-1 pb-0 px-3 border-bottom">
                                            <div className="d-flex border-bottom py-2">
                                                <p className="text-primary font-bold mb-0">Loại máy chủ:</p>
                                                <p className="ml-2 mb-0 font-bold word-break-all">{instance.plan.title}</p>
                                            </div>
                                            <div className="d-flex border-bottom py-2">
                                                <p className="text-primary font-bold mb-0">vCPU:</p>
                                                <p className="ml-2 mb-0 font-bold word-break-all">{productSelect?.core} GB</p>
                                            </div>
                                            <div className="d-flex border-bottom py-2">
                                                <p className="text-primary font-bold mb-0">RAM:</p>
                                                <p className="ml-2 mb-0 font-bold word-break-all">{productSelect?.memory / 1024} GB</p>
                                            </div>
                                            <div className="d-flex py-2">
                                                <p className="text-primary font-bold mb-0">DISK: </p>
                                                <p className="ml-2 mb-0 font-bold word-break-all">{productSelect?.disk} GB</p>
                                            </div>
                                        </div>

                                        <div className="">
                                            <div className="cloud_server-footer">
                                                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                                                    <span className="font-bold">Giá gói chênh lệch</span>
                                                    <span className="font-bold">
                                                        {convertCurrency(
                                                            calculateUpgradeCost(
                                                                instance.pricing.price * (1 - instance.pricing.discount / 100),
                                                                productSelect?.pricing?.price *
                                                                    (1 - productSelect?.pricing?.discount / 100),
                                                                calculateDaysLeftInstances(instance.expired_at),
                                                                getDaysInCurrentMonth(),
                                                            ),
                                                        )}
                                                    </span>
                                                </div>
                                                <Flex align="center" justify="space-between" className="px-3 py-2 border-bottom">
                                                    <div className="font-bold">Tổng phí đổi gói</div>
                                                    <span className="font-size-18 font-bold text-primary">
                                                        <span>
                                                            {convertCurrency(
                                                                calculateUpgradeCost(
                                                                    instance.pricing.price * (1 - instance.pricing.discount / 100),
                                                                    productSelect?.pricing?.price *
                                                                        (1 - productSelect?.pricing?.discount / 100),
                                                                    calculateDaysLeftInstances(instance.expired_at),
                                                                    getDaysInCurrentMonth(),
                                                                ),
                                                            )}
                                                        </span>
                                                        <span className="font-size-13 text-subtitle">
                                                            {' '}
                                                            /{' '}
                                                            {calculateRemainingRatio(
                                                                calculateDaysLeftInstances(instance.expired_at),
                                                                getDaysInCurrentMonth(),
                                                            )}{' '}
                                                            Tháng
                                                        </span>
                                                    </span>
                                                </Flex>

                                                <div className="px-3 py-2 d-flex gap-2">
                                                    <Button
                                                        size="large"
                                                        type="primary"
                                                        className="box-center flex-1"
                                                        icon={<IconChecks size={24} />}
                                                        onClick={() => setModalVisible(true)}
                                                        loading={loadingRebuild}
                                                    >
                                                        {loadingRebuild ? <span className="ml-1">Loading...</span> : <span>Xác nhận</span>}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Col>
            ) : (
                <Flex align="center" justify="center" className="w-full" style={{ minHeight: '60vh' }}>
                    <Spin />
                </Flex>
            )}
        </Row>
    );
}

export default ResizeInstance;
