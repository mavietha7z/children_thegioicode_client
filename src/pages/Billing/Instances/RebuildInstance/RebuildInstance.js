import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Avatar, Breadcrumb, Button, Card, Col, Flex, Modal, Row, Select, Spin, notification } from 'antd';
import { IconCpu, IconNetwork, IconArrowLeft, IconCalendarPlus, IconArrowBackUp, IconCheck } from '@tabler/icons-react';

import router from '~/configs/routes';
import { serviceCopyKeyBoard } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import imageAvatarDefault from '~/assets/image/avatar-default.png';
import IconCheckMarkDefault from '~/assets/icon/IconCheckMarkDefault';
import { requestUserGetCloudServerImages } from '~/services/cloudServer';
import { requestUserGetInstanceDetail, requestUserRebuildInstance } from '~/services/billing';

function RebuildInstance() {
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingRebuild, setLoadingRebuild] = useState(false);

    const [loading, setLoading] = useState(true);
    const [instance, setInstance] = useState(null);

    const [images, setImages] = useState([]);
    const [imageSelect, setImageSelect] = useState(null);
    const [activeImageId, setActiveImageId] = useState(0);
    const [imageSelectOption, setImageSelectOption] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { instance_id } = useParams();

    useEffect(() => {
        if (instance_id) {
            document.title = `Netcode.vn - #${instance_id}`;

            // Các hàm tiện ích
            const handleUnauthorized = () => {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            };

            const handleError = (error, redirectUrl) => {
                navigate(redirectUrl);
                notification.error({
                    message: 'Thông báo',
                    description: error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            };

            const fetch = async () => {
                try {
                    // Gọi song song hai API để giảm thời gian chờ
                    const [resultInstance, resultImage] = await Promise.all([
                        requestUserGetInstanceDetail(instance_id),
                        requestUserGetCloudServerImages(),
                    ]);

                    // Xử lý kết quả của resultImage
                    if ([401, 403].includes(resultImage.status)) {
                        handleUnauthorized();
                        return;
                    } else if (resultImage.status === 200) {
                        const firstVersion = resultImage.data[0]?.versions[0];

                        setImages(resultImage.data);
                        setImageSelect(firstVersion);
                        setImageSelectOption(firstVersion?.title);
                    } else {
                        handleError(resultImage?.error, router.billing_instances);
                        return;
                    }

                    // Xử lý kết quả của resultInstance
                    if ([401, 403].includes(resultInstance.status)) {
                        handleUnauthorized();
                    } else if (resultInstance.status === 200) {
                        setInstance(resultInstance.data);
                    } else {
                        handleError(resultInstance?.error, router.billing_instances);
                    }
                } catch (error) {
                    // Xử lý lỗi nếu API gặp vấn đề
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lỗi hệ thống vui lòng thử lại sau.',
                    });
                } finally {
                    setLoading(false);
                }
            };

            fetch();
        } else {
            navigate(router.billing_instances);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance_id]);

    // Chọn hệ điều hành
    const handleSelectImage = (image, index) => {
        if (activeImageId !== index) {
            setActiveImageId(index);
            setImageSelect(image.versions[0]);
            setImageSelectOption(image.versions[0].title);
        }
    };

    // Chọn phiên bản hệ điều hành
    const handleSelectOptionImage = (value, image) => {
        const versionIndex = image.versions.findIndex((tem) => tem.title === value);

        setImageSelectOption(value);
        setImageSelect(image.versions[versionIndex]);
    };

    // Rebuild
    const handleRebuildInstance = async () => {
        const data = {
            instance_id,
            image_id: imageSelect.id,
        };

        setModalVisible(false);
        setLoadingRebuild(true);

        const result = await requestUserRebuildInstance(data);

        setLoadingRebuild(false);
        if (result.status === 401 || result.status === 403) {
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
        <div className="container">
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
                                    title: 'Rebuild',
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
                        onOk={handleRebuildInstance}
                        onCancel={() => setModalVisible(false)}
                        width={460}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        title="Rebuild máy chủ"
                    >
                        <p>Bạn có chắn chắn muốn Rebuild không?</p>
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
                                                    <div className="d-flex text-subtitle text-normal gap-1">
                                                        <span className="anticon cursor-pointer text-primary">
                                                            <IconCpu size={14} />
                                                        </span>
                                                        {instance.product.core} vCPU / {instance.product.memory / 1024}GB RAM /{' '}
                                                        {instance.product.disk}GB SSD
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Alert
                                        message="Cảnh báo: Dữ liệu bên trong của máy chủ sẽ bị xóa vĩnh viễn khi máy chủ được Rebuild lại"
                                        type="warning"
                                        showIcon
                                        className="my-5"
                                    />

                                    <Row className="pt-3" style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
                                        {images.map((image, index) => (
                                            <Col md={6} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }} key={index}>
                                                <div
                                                    className="card_item_image_shadow flex-column p-0"
                                                    data-active={activeImageId === index}
                                                    onClick={() => handleSelectImage(image, index)}
                                                >
                                                    <Flex align="center" justify="center" className="w-full gap-3 py-3 border-bottom">
                                                        <Avatar
                                                            className="rounded-0"
                                                            src={image.image_url}
                                                            style={{ width: 35, height: 35, lineHeight: 35, fontSize: 18 }}
                                                        />

                                                        <div className="title width-max-content font-semibold">{image.title}</div>
                                                    </Flex>

                                                    <Select
                                                        className="w-full text-subtitle text-center input_select_link"
                                                        placeholder="Chọn phiên bản"
                                                        dropdownStyle={{ textAlign: 'center' }}
                                                        value={activeImageId === index ? imageSelectOption : undefined}
                                                        onChange={(e) => handleSelectOptionImage(e, image)}
                                                        options={image.versions.map((version) => {
                                                            return {
                                                                label: version.title,
                                                                value: version.title,
                                                            };
                                                        })}
                                                    />

                                                    {activeImageId === index && <IconCheckMarkDefault />}
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Flex flex="wrap" className="gap-3 mt-7">
                                        <Button
                                            size="large"
                                            className="box-center"
                                            onClick={() => navigate(`${router.billing_instances}/${instance_id}`)}
                                            icon={<IconArrowBackUp size={20} />}
                                        >
                                            Quay về
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="box-center"
                                            onClick={() => setModalVisible(true)}
                                            loading={loadingRebuild}
                                            icon={<IconCheck size={20} />}
                                        >
                                            {loadingRebuild ? <span className="ml-1">Loading...</span> : <span>Rebuild</span>}
                                        </Button>
                                    </Flex>
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

export default RebuildInstance;
