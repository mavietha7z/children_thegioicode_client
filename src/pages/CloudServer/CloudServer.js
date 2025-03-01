import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Breadcrumb, Button, Card, Col, Flex, Input, notification, Row, Select, Space } from 'antd';
import {
    IconCpu,
    IconPlus,
    IconWorld,
    IconMinus,
    IconChecks,
    IconArrowLeft,
    IconShoppingBag,
    IconDeviceFloppy,
    IconDeviceSdCard,
    IconBrandSpeedtest,
} from '@tabler/icons-react';

import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserAddProductToCart } from '~/services/cart';
import {
    requestUserGetCloudServerImages,
    requestUserGetCloudServerRegions,
    requestUserGetCloudServerProducts,
} from '~/services/cloudServer';

import imageCloudServerOs from '~/assets/image/cloud-server-os.png';
import IconCheckMarkDefault from '~/assets/icon/IconCheckMarkDefault';
import imageCloudServerInfo from '~/assets/image/cloud-server-info.png';
import imageCloudServerPlan from '~/assets/image/cloud-server-plan.png';
import imageCloudServerRegion from '~/assets/image/cloud-server-region.png';
import imageCloudServerCycles from '~/assets/image/cloud-server-cycles.png';
import imageCloudServerProduct from '~/assets/image/cloud-server-product.png';

function CloudServer() {
    const [loadingDeploy, setLoadingDeploy] = useState(false);

    const [plans, setPlans] = useState([]);
    const [planSelect, setPlanSelect] = useState(null);
    const [activePlanId, setActivePlanId] = useState(null);

    const [regions, setRegions] = useState([]);
    const [regionSelect, setRegionSelect] = useState(null);
    const [activeRegionId, setActiveRegionId] = useState(null);

    const [images, setImages] = useState([]);
    const [imageSelect, setImageSelect] = useState(null);
    const [activeImageId, setActiveImageId] = useState(0);
    const [imageSelectOption, setImageSelectOption] = useState(null);

    const [cyclesSelect, setCyclesSelect] = useState(null);
    const [activeCyclesId, setActiveCyclesId] = useState(0);
    const [cyclesPayments, setCyclesPayments] = useState([]);

    const [products, setProducts] = useState([]);
    const [productSelect, setProductSelect] = useState(null);
    const [activeProductId, setActiveProductId] = useState(null);

    const [pricingSelect, setPricingSelect] = useState(null);

    const [cloudServerCount, setCloudServerCount] = useState(1);
    const [errorServerNames, setErrorServerNames] = useState(['']);
    const [serverNames, setServerNames] = useState([`instance_${Math.floor(Math.random() * 99999999) + 1}`]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetch = async () => {
            const [resultRegion, resultImage] = await Promise.all([requestUserGetCloudServerRegions(), requestUserGetCloudServerImages()]);

            if (resultRegion.status === 200) {
                setRegions(resultRegion.data);
                setRegionSelect(resultRegion.data[0]);
                setActiveRegionId(resultRegion.data[0]?.id);

                if (resultRegion.data[0]?.plans.length > 0) {
                    setPlans(resultRegion.data[0].plans);
                    setPlanSelect(resultRegion.data[0].plans[0]);

                    const resultProduct = await requestUserGetCloudServerProducts(resultRegion.data[0].plans[0].id);
                    if (resultProduct.status === 200) {
                        setProducts(resultProduct.data);

                        const productSelect = resultProduct.data[0];
                        setProductSelect(productSelect);
                        setActiveProductId(productSelect?.id);

                        setCyclesPayments(resultProduct.cycles);
                        if (resultProduct.cycles.length > 0) {
                            const cyclesSelect = resultProduct.cycles[0].title;
                            setCyclesSelect(cyclesSelect);

                            const pricing = productSelect?.pricings.find((pricing) => pricing.cycles.display_name === cyclesSelect);
                            if (pricing) {
                                setPricingSelect(pricing);
                            }
                        }
                    }

                    const firstPlan = resultRegion.data[0].plans[0];
                    if (firstPlan) {
                        setActivePlanId(firstPlan.id);
                    }
                }
            }

            if (resultImage.status === 200) {
                setImages(resultImage.data);
                setImageSelect(resultImage.data[0]?.versions[0]);
                setImageSelectOption(resultImage.data[0]?.versions[0].title);
            }
        };

        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cập nhật mảng serverNames và errorServerNames khi cloudServerCount thay đổi
    useEffect(() => {
        setServerNames((prevNames) => {
            const newNames = [...prevNames];
            if (cloudServerCount > newNames.length) {
                // Thêm tên máy chủ mới với tên mặc định
                for (let i = newNames.length + 1; i <= cloudServerCount; i++) {
                    newNames.push(`instance_${Math.floor(Math.random() * 99999999) + 1}`);
                }
            } else if (cloudServerCount < newNames.length) {
                // Xóa tên máy chủ không cần thiết
                newNames.length = cloudServerCount;
            }
            return newNames;
        });

        setErrorServerNames((prevErrors) => {
            const newErrors = [...prevErrors];
            if (cloudServerCount > newErrors.length) {
                for (let i = newErrors.length; i < cloudServerCount; i++) {
                    newErrors.push('');
                }
            } else if (cloudServerCount < newErrors.length) {
                newErrors.length = cloudServerCount;
            }
            return newErrors;
        });
    }, [cloudServerCount]);

    // Chọn loại máy chủ
    const handleSelectPlan = async (plan) => {
        setPlanSelect(plan);
        setActivePlanId(plan.id);

        const resultProduct = await requestUserGetCloudServerProducts(plan.id);
        if (resultProduct.status === 200) {
            setProducts(resultProduct.data);
            setProductSelect(resultProduct.data[0]);
        }
    };

    // Chọn khu vực
    const handleSelectRegion = async (region) => {
        // Set khu vực đang chọn
        setActiveRegionId(region.id);
        setRegionSelect(region);

        // Set lại plan và gọi api lấy sản phẩm phan được chọn
        setPlans(region.plans);
        const firstPlan = region.plans[0];
        if (firstPlan) {
            setPlanSelect(firstPlan);
            setActivePlanId(firstPlan.id);
        }

        const resultProduct = await requestUserGetCloudServerProducts(region.plans[0]?.id);
        if (resultProduct.status === 200) {
            setProducts(resultProduct.data);
            setProductSelect(resultProduct.data[0]);
        }
    };

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

    // Chọn chu kỳ thanh toán
    const handleSelectCycles = (cycles, index) => {
        setActiveCyclesId(index);
        setCyclesSelect(cycles.title);

        const pricing = productSelect.pricings.find((pricing) => pricing.cycles.display_name === cycles.title);
        if (pricing) {
            setPricingSelect(pricing);
        }
    };

    // Chọn gói
    const handleSelectProduct = (product) => {
        setProductSelect(product);
        setCyclesSelect(cyclesSelect);
        setActiveProductId(product.id);

        const pricing = product.pricings.find((pricing) => pricing.cycles.display_name === cyclesSelect);
        if (pricing) {
            setPricingSelect(pricing);
        }
    };

    // Xử lý thay đổi tên máy chủ
    const handleChangeServerName = (index, value) => {
        const newNames = [...serverNames];
        newNames[index] = value;
        setServerNames(newNames);

        const newErrors = [...errorServerNames];

        // Kiểm tra độ dài
        if (value.length < 4 || value.length > 40) {
            newErrors[index] = 'Tên máy chủ phải từ 4 đến 40 ký tự.';
        }
        // Kiểm tra ký tự hợp lệ
        else if (!/^[A-Za-z0-9_-]+$/.test(value)) {
            newErrors[index] = 'Tên máy chủ chỉ chứa chữ cái, số, dấu gạch ngang (-), và gạch dưới (_).';
        }
        // Kiểm tra không bắt đầu hoặc kết thúc bằng ký tự đặc biệt
        else if (/^[-_]/.test(value) || /[-_]$/.test(value)) {
            newErrors[index] = 'Tên máy chủ không được bắt đầu hoặc kết thúc bằng dấu (-) và (_).';
        }
        // Không có lỗi
        else {
            newErrors[index] = '';
        }

        setErrorServerNames(newErrors);
    };

    // Thêm vào giỏ hàng
    const handleDeployCloudServer = async () => {
        if (!currentUser) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng đăng nhập để tiếp tục',
            });
        }

        if (!planSelect) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn loại máy chủ',
            });
        }

        if (!regionSelect) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn khu vực đặt máy chủ',
            });
        }
        if (!imageSelect) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn hệ điều hành máy chủ',
            });
        }
        if (!pricingSelect) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn chu kỳ thanh toán',
            });
        }

        if (!productSelect) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn cấu hình cần tạo',
            });
        }
        if (productSelect.sold_out) {
            return notification.error({
                message: 'Thông báo',
                description: 'Cấu hình máy chủ muốn tạo đã hết hàng',
            });
        }

        const data = {
            plan_id: planSelect.id,
            image_id: imageSelect.id,
            display_name: serverNames,
            region_id: regionSelect.id,
            pricing_id: pricingSelect.id,
            product_id: productSelect.id,
        };

        setLoadingDeploy(true);

        const result = await requestUserAddProductToCart('cloud-server', data);

        setLoadingDeploy(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        } else if (result?.status === 200) {
            navigate(router.cart);

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
            <Helmet>
                <title>Netcode.vn - Máy chủ ảo điện toán đám mây</title>
                <meta
                    key="description"
                    name="description"
                    content="Khởi tạo máy chủ Cloud Server, Cloud VPS tốc độ cao cùng với các chu kỳ thanh toán linh hoạt và hỗ trợ chuyên nghiệp 24/7"
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://netcode.vn${router.cloud_server}`} />
                <meta property="og:url" content={`https://netcode.vn${router.cloud_server}`} />
                <meta property="og:title" content="Netcode.vn - Máy chủ ảo điện toán đám mây" />
                <meta property="og:image" content="https://netcode.vn/images/WaXXUWGPTf.png" />
                <meta
                    property="og:description"
                    content="Khởi tạo máy chủ Cloud Server, Cloud VPS tốc độ cao cùng với các chu kỳ thanh toán linh hoạt và hỗ trợ chuyên nghiệp 24/7"
                />
            </Helmet>

            <Row style={{ rowGap: 16 }}>
                <Col span={24}>
                    <Flex className="gap-2 pl-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.home)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: 'Tạo máy chủ',
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                <Col md={19} xs={24} style={{ padding: '0 8px' }}>
                    <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
                        <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title={
                                    <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                        <div className="d-flex align-items-center gap-2">
                                            <Avatar
                                                className="rounded-0"
                                                src={imageCloudServerPlan}
                                                style={{ width: 25, height: 25, lineHeight: 25, fontSize: 18 }}
                                            />
                                            <div className="flex-1">Loại máy chủ</div>
                                        </div>
                                    </h2>
                                }
                            >
                                <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
                                    {plans.map((plan) => (
                                        <Col md={6} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }} key={plan.id}>
                                            <div
                                                className="item-plan-instance align-items-center"
                                                data-active={activePlanId === plan.id}
                                                onClick={() => handleSelectPlan(plan)}
                                            >
                                                <Flex align="center" justify="center" className="w-full flex-column">
                                                    <Avatar
                                                        className="rounded-0"
                                                        src={plan.image_url}
                                                        style={{ width: 60, height: 60, lineHeight: 60, fontSize: 30 }}
                                                    />
                                                    <div className="title w-auto font-semibold font-size-20 mt-2 mb-1">{plan.title}</div>
                                                    <div className="text-subtitle text-center">{plan.description}</div>
                                                </Flex>

                                                {activePlanId === plan.id && <IconCheckMarkDefault />}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>

                        <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title={
                                    <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                        <div className="d-flex align-items-center gap-2">
                                            <Avatar
                                                className="rounded-0"
                                                src={imageCloudServerRegion}
                                                style={{ width: 25, height: 25, lineHeight: 25, fontSize: 18 }}
                                            />
                                            <div className="flex-1">Khu vực</div>
                                        </div>
                                    </h2>
                                }
                            >
                                <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
                                    {regions.map((region) => (
                                        <Col md={6} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }} key={region.id}>
                                            <div
                                                className="item-plan-instance align-items-center"
                                                data-active={activeRegionId === region.id}
                                                onClick={() => handleSelectRegion(region)}
                                            >
                                                <Flex align="center" justify="center" className="w-full gap-3">
                                                    <Avatar
                                                        className="rounded-0"
                                                        src={region.image_url}
                                                        style={{ width: 35, height: 35, lineHeight: 35, fontSize: 18 }}
                                                    />

                                                    <div className="title w-auto font-semibold">{region.title}</div>
                                                </Flex>

                                                {activeRegionId === region.id && <IconCheckMarkDefault />}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>

                        <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title={
                                    <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                        <div className="d-flex align-items-center gap-2">
                                            <Avatar
                                                className="rounded-0"
                                                src={imageCloudServerOs}
                                                style={{ width: 25, height: 25, lineHeight: 25, fontSize: 18 }}
                                            />
                                            <div className="flex-1">Hệ điều hành</div>
                                        </div>
                                    </h2>
                                }
                            >
                                <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
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
                            </Card>
                        </Col>

                        <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title={
                                    <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                        <div className="d-flex align-items-center gap-2">
                                            <Avatar
                                                className="rounded-0"
                                                src={imageCloudServerCycles}
                                                style={{ width: 25, height: 25, lineHeight: 25, fontSize: 18 }}
                                            />
                                            <div className="flex-1">Chu kỳ thanh toán</div>
                                        </div>
                                    </h2>
                                }
                            >
                                <div className="border rounded">
                                    <div className="p-2 border-bottom text-center font-bold" style={{ backgroundColor: '#f0f2f4' }}>
                                        Thời gian thanh toán
                                    </div>
                                    <Row>
                                        {cyclesPayments.map((cycle, index) => (
                                            <Col md={6} xs={24} key={index}>
                                                <div
                                                    onClick={() => handleSelectCycles(cycle, index)}
                                                    className={
                                                        activeCyclesId === index
                                                            ? 'border-2 cursor-pointer p-2 text-center font-weight-bold border-primary text-primary'
                                                            : 'border border-2 cursor-pointer p-2 text-center font-weight-bold hover-border-primary hover-blue'
                                                    }
                                                >
                                                    {cycle.title}
                                                    {cycle.discount && (
                                                        <span className="bg-card-gray font-size-11 px-1 rounded-md ml-1 text-danger font-bold">
                                                            {cycle.discount}
                                                        </span>
                                                    )}

                                                    {activeCyclesId === index && <IconCheckMarkDefault />}
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Card>
                        </Col>

                        <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title={
                                    <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                        <div className="d-flex align-items-center gap-2">
                                            <Avatar
                                                className="rounded-0"
                                                src={imageCloudServerProduct}
                                                style={{ width: 25, height: 25, lineHeight: 25, fontSize: 18 }}
                                            />
                                            <div className="flex-1">Gói dịch vụ</div>
                                        </div>
                                    </h2>
                                }
                            >
                                <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
                                    {products.map((product) => (
                                        <Col md={6} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }} key={product.id}>
                                            <div
                                                className="item-plan-instance flex-column align-items-center mr-0 mt-0"
                                                data-active={activeProductId === product.id}
                                                onClick={() => handleSelectProduct(product)}
                                            >
                                                <div className="title font-size-16 font-bold text-center mb-2">{product.title}</div>
                                                <div className="font-size-23 font-bold text-center text-primary">
                                                    {product.sold_out ? (
                                                        <span>Hết hàng</span>
                                                    ) : (
                                                        <Fragment>
                                                            {product.pricings
                                                                .filter((pricing) => pricing.cycles.display_name === cyclesSelect)
                                                                .map((pricing) => convertCurrency(pricing.price))
                                                                .shift() || 'N/A'}
                                                        </Fragment>
                                                    )}
                                                </div>
                                                {cyclesSelect !== '1 Tháng' && (
                                                    <div className="font-size-18 text-center text-line-through text-subtitle">
                                                        {product.pricings
                                                            .filter((pricing) => pricing.cycles.display_name === cyclesSelect)
                                                            .map((pricing) => convertCurrency(pricing.price / (1 - pricing.discount / 100)))
                                                            .shift() || 'N/A'}
                                                    </div>
                                                )}

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
                                                            <span className="ml-1">SSD</span>
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
                                                        <div>{product.ipv4} Địa chỉ</div>
                                                    </Flex>
                                                </div>

                                                {activeProductId === product.id && <IconCheckMarkDefault />}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        </Col>

                        <Col span={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title={
                                    <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                        <div className="d-flex align-items-center gap-2">
                                            <Avatar
                                                className="rounded-0"
                                                src={imageCloudServerInfo}
                                                style={{ width: 25, height: 25, lineHeight: 25, fontSize: 18 }}
                                            />
                                            <div className="flex-1">Thông tin máy chủ</div>
                                        </div>
                                    </h2>
                                }
                            >
                                <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 16 }}>
                                    <Col md={8} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                                        <div className="font-size-16 font-semibold mb-3">Số lượng máy chủ</div>
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Button
                                                size="large"
                                                className="box-center"
                                                disabled={cloudServerCount < 2}
                                                onClick={() => setCloudServerCount(cloudServerCount - 1)}
                                            >
                                                <IconMinus size={24} />
                                            </Button>
                                            <Input size="large" value={cloudServerCount} className="text-center" readOnly />
                                            <Button
                                                size="large"
                                                className="box-center"
                                                disabled={cloudServerCount > 9}
                                                onClick={() => setCloudServerCount(cloudServerCount + 1)}
                                            >
                                                <IconPlus size={24} />
                                            </Button>
                                        </Space.Compact>
                                    </Col>
                                    <Col md={16} xs={24} style={{ paddingLeft: 8, paddingRight: 8 }}>
                                        <div className="font-size-16 font-semibold mb-3">Tên máy chủ</div>
                                        {serverNames.map((name, index) => (
                                            <div className="mb-3" key={index}>
                                                <Input
                                                    size="large"
                                                    value={name}
                                                    placeholder={`Tên máy chủ ${index + 1}`}
                                                    onChange={(e) => handleChangeServerName(index, e.target.value)}
                                                />
                                                {errorServerNames[index] && <span className="text-danger">{errorServerNames[index]}</span>}
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
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
                                        <p className="ml-2 mb-0 font-bold word-break-all">{planSelect?.title}</p>
                                    </div>
                                    <div className="d-flex border-bottom py-2">
                                        <p className="text-primary font-bold mb-0">Khu vực:</p>
                                        <p className="ml-2 mb-0 font-bold word-break-all">{regionSelect?.title}</p>
                                    </div>
                                    <div className="d-flex border-bottom py-2">
                                        <p className="text-primary font-bold mb-0">Hệ điều hành:</p>
                                        <p className="ml-2 mb-0 font-bold word-break-all">{imageSelect?.title}</p>
                                    </div>
                                    <div className="border-bottom py-2">
                                        <p className="text-primary font-bold mb-0">Gói dịch vụ:</p>
                                        {productSelect ? (
                                            <Fragment>
                                                <p className="mb-0 font-bold">{productSelect?.core} vCPU</p>
                                                <p className="mb-0 font-bold">{productSelect?.memory / 1024} GB RAM</p>
                                                <p className="mb-0 font-bold">{productSelect?.disk} GB SSD</p>
                                            </Fragment>
                                        ) : (
                                            <p className="mb-0 font-bold">Chưa chọn</p>
                                        )}
                                    </div>
                                    <div className="d-flex border-bottom py-2">
                                        <p className="text-primary font-bold mb-0">Chu kỳ:</p>
                                        <p className="ml-2 mb-0 font-bold word-break-all">{cyclesSelect}</p>
                                    </div>
                                    <div className="d-flex py-2">
                                        <p className="text-primary font-bold mb-0">Số lượng máy chủ:</p>
                                        <p className="ml-2 mb-0 font-bold word-break-all">{cloudServerCount}</p>
                                    </div>
                                </div>

                                <div className="cloud_server-footer">
                                    {!productSelect?.sold_out && (
                                        <Fragment>
                                            {pricingSelect?.discount > 0 && (
                                                <Fragment>
                                                    <Flex align="center" justify="space-between" className="px-3 py-2 border-bottom">
                                                        <div className="font-bold">Thành tiền</div>
                                                        <span className="font-bold">
                                                            {convertCurrency(
                                                                (pricingSelect?.price / (1 - pricingSelect?.discount / 100)) *
                                                                    cloudServerCount,
                                                            )}
                                                        </span>
                                                    </Flex>
                                                    <Flex align="center" justify="space-between" className="px-3 py-2 border-bottom">
                                                        <div className="font-bold">Chiết khấu</div>
                                                        <span className="font-bold text-danger">
                                                            {convertCurrency(
                                                                (pricingSelect?.price -
                                                                    pricingSelect?.price / (1 - pricingSelect?.discount / 100)) *
                                                                    cloudServerCount,
                                                            )}
                                                        </span>
                                                    </Flex>
                                                </Fragment>
                                            )}

                                            <Flex align="center" justify="space-between" className="px-3 py-2 border-bottom">
                                                <div className="font-bold">Tổng tiền</div>
                                                <span className="font-size-18 font-bold text-primary">
                                                    {convertCurrency(pricingSelect?.price * cloudServerCount)}
                                                </span>
                                            </Flex>

                                            <div className="px-3 py-2 d-flex gap-2">
                                                <Button
                                                    size="large"
                                                    type="primary"
                                                    className="box-center flex-1"
                                                    icon={<IconChecks size={24} />}
                                                    onClick={handleDeployCloudServer}
                                                    loading={loadingDeploy}
                                                    disabled={productSelect?.sold_out}
                                                >
                                                    {loadingDeploy ? <span className="ml-1">Đang xử lý...</span> : <span>Tiếp tục</span>}
                                                </Button>
                                            </div>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
}

export default CloudServer;
