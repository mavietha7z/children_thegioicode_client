import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, Button, Card, Carousel, Col, Flex, Row } from 'antd';

import Support from './Support';
import router from '~/configs/routes';
import ServiceUsing from './ServiceUsing';
import { convertCurrency } from '~/configs';
import iconSource from '~/assets/image/icon_source.png';
import iconPublicApi from '~/assets/image/icon_public-api.svg';
import imageAvatarDefault from '~/assets/image/avatar-default.png';
import imageCloudServer from '~/assets/image/icon-cloud_server.svg';
import imageWebTemplate from '~/assets/image/icon-web-template.png';
import imageProxyServer from '~/assets/image/icon-proxy-server.png';

import imageCarouselSourceCode from '~/assets/image/carousel-source.svg';
import imageCarouselPublicApi from '~/assets/image/carousel-public-api.svg';
import imageCarouselCloudServer from '~/assets/image/carousel-cloud-server.png';
import imageCarouselProxyServer from '~/assets/image/carousel-proxy-server.svg';

const servicesData = [
    {
        id: 1,
        title: 'Tạo Website',
        description: 'Rút ngắn thời gian, bảo mật, bảo hành trọn đời',
        link: router.templates,
        src: imageWebTemplate,
    },
    {
        id: 2,
        title: 'Mã Nguồn',
        description: 'Kho giao diện mã nguồn phong phú giúp triển khai website nhanh chóng',
        link: router.sources,
        src: iconSource,
    },
    {
        id: 3,
        title: 'Cloud Server',
        description: 'Khởi tạo Cloud Server trong vài giây, toàn quyền quản trị',
        link: router.cloud_server,
        src: imageCloudServer,
    },
    {
        id: 4,
        title: 'Proxy Server',
        description: 'Tiết kiệm băng thông và tăng tốc độ mạng',
        link: router.proxy_server,
        src: imageProxyServer,
    },
    {
        id: 5,
        title: 'Public API',
        description: 'API giúp tiếp cận nhiều chức năng website',
        link: router.public_apis,
        src: iconPublicApi,
    },
];

const carousels = [
    {
        title: 'Public API',
        description: 'API giúp bạn tiếp cận thêm các chức năng hoặc thuận tiện hơn trong công việc',
        link_to: router.public_apis,
        btn_text: 'Xem thử ngay',
        img_url: imageCarouselPublicApi,
    },
    {
        title: 'Tài khoản',
        description: 'Cung cấp nhiều loại tài khoản như TikTok, Fb, BM, Gmail cho mọi người làm mmo',
        link_to: router.public_apis,
        btn_text: 'Xem thử ngay',
        img_url: imageCarouselSourceCode,
    },
    {
        title: 'Mã nguồn',
        description: 'Với kho giao diện lớn đảm bảo các giao diện giúp tiết kiệm chi phí và rút ngắn thời gian xây dựng website',
        link_to: router.sources,
        btn_text: 'Tìm hiểu thêm',
        img_url: imageCarouselSourceCode,
    },
    {
        title: 'Tạo website',
        description: 'Các mẫu website có sẵn dành cho người không có chuyên môn với tiêu chí nhanh - gọn - bảo mật - bảo hành trọn đời',
        link_to: router.templates,
        btn_text: 'Xem chi tiết',
        img_url: imageCarouselSourceCode,
    },
    {
        title: 'Proxy Server',
        description:
            'Bảo mật dữ liệu và quyền riêng tư, đảm bảo tính sẵn sàng và hiệu suất cao, tiết kiệm băng thông và cải thiện tốc độ mạng',
        link_to: router.proxy_server,
        btn_text: 'Bắt đầu ngay',
        img_url: imageCarouselProxyServer,
    },
    {
        title: 'Cloud Server',
        description: 'Khởi tạo Cloud Server trong vài giây với giao diện quản trị thông minh và tự động hoàn toàn 100%',
        link_to: router.cloud_server,
        btn_text: 'Dùng thử ngay',
        img_url: imageCarouselCloudServer,
    },
];

function Home() {
    const { currentUser } = useSelector((state) => state.auth);

    return (
        <Fragment>
            <Row style={{ rowGap: 16 }}>
                <Col md={18} style={{ padding: '0 8px' }}>
                    <Card className="rounded-15" style={{ minHeight: 'calc(-120px + 100vh)' }}>
                        <div className="mb-8">
                            <Carousel autoplay autoplaySpeed={5000}>
                                {carousels.map((carousel, index) => (
                                    <div key={index} style={{ height: '100%' }}>
                                        <div className="home-carousel-item">
                                            <div className="carousel-container">
                                                <div className="row align-items-center">
                                                    <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12 mobile-col">
                                                        <div className="carousel-content">
                                                            <h1 className="headline text-white text-uppercase">{carousel.title}</h1>
                                                            <p className="description text-white">{carousel.description}</p>
                                                            <div className="button-action">
                                                                <Link
                                                                    to={carousel.link_to}
                                                                    className="btn-blue btn-radius btn-netcode btn-big-large text-uppercase"
                                                                >
                                                                    {carousel.btn_text}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 mobile-hidden">
                                                        <img className="object-fit-cover" src={carousel.img_url} alt={carousel.title} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        {currentUser && <ServiceUsing />}

                        <div>
                            <h2 className="font-semibold font-size-20 mb-5">Khởi tạo dịch vụ với hệ sinh thái Netcode</h2>

                            <Row
                                style={{
                                    marginLeft: -5,
                                    marginRight: -5,
                                    rowGap: 10,
                                }}
                            >
                                {servicesData.map((service) => (
                                    <Col md={8} xs={24} style={{ paddingLeft: 5, paddingRight: 5 }} key={service.id}>
                                        <Link to={service.link}>
                                            <Card hoverable style={{ padding: 2 }}>
                                                <Flex className="gap-2">
                                                    <Avatar
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            lineHeight: 50,
                                                            fontSize: 25,
                                                            background: '#096eff',
                                                        }}
                                                        src={service.src}
                                                    />
                                                    <div className="link-color flex-1">
                                                        <h4 className="font-bold text-primary line-height-20 mb-0 font-size-16">
                                                            {service.title}
                                                        </h4>
                                                        <p className="line-height-20 mt-2px text-subtitle">{service.description}</p>
                                                    </div>
                                                </Flex>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Card>
                </Col>

                <Col md={6} style={{ padding: '0 8px' }} className="flex-1">
                    {currentUser && (
                        <Card
                            className="rounded-15 mb-4"
                            title={
                                <h2 className="font-semibold mb-0 white-space-break">
                                    <span className="font-size-18 font-semibold">Thông tin tài khoản</span>
                                </h2>
                            }
                        >
                            <Flex align="center" justify="center" className="h-full flex-column">
                                <Avatar
                                    src={currentUser.avatar_url || imageAvatarDefault}
                                    style={{ fontSize: 50, width: 100, height: 100, lineHeight: 100 }}
                                />
                                <h3 className="text-center font-semibold mt-2 mb-0 font-size-20">{currentUser.full_name}</h3>
                                <h3 className="text-center mt-1 mb-0 text-subtitle font-size-16">{currentUser.email}</h3>

                                <div className="w-full mt-6">
                                    <Link to={router.profile}>
                                        <Button block className="rounded-10 mt-4 min-height-35">
                                            Quản lý tài khoản
                                        </Button>
                                    </Link>
                                    <Link to={router.billing}>
                                        <Button block type="primary" className="rounded-10 mt-2 min-height-35 boxshadow-none">
                                            Nạp tiền vào tài khoản
                                        </Button>
                                    </Link>
                                </div>

                                <Flex justify="space-between" className="mt-8 mb-2 w-full">
                                    <span className="text-sub-title font-size-15">Tài khoản chính:</span>
                                    <span className="text-primary font-size-18 font-semibold">
                                        {convertCurrency(currentUser.wallet.credit_balance)}
                                    </span>
                                </Flex>
                                <Flex justify="space-between" className="w-full">
                                    <span className="text-sub-title font-size-15">Tài khoản khuyễn mãi:</span>
                                    <span className="text-primary font-size-18 font-semibold">
                                        {convertCurrency(currentUser.wallet.bonus_balance)}
                                    </span>
                                </Flex>
                            </Flex>
                        </Card>
                    )}

                    <Support />
                </Col>
            </Row>
        </Fragment>
    );
}

export default Home;
