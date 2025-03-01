import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconEye } from '@tabler/icons-react';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Image, Row } from 'antd';

import router from '~/configs/routes';
import imageNotFound from '~/assets/image/image_not.jpg';

function Source() {
    const navigate = useNavigate();

    return (
        <Fragment>
            <Helmet>
                <title>Thegioicode.com - Phần mềm mã nguồn</title>
                <meta
                    key="description"
                    name="description"
                    content="Phần mềm mã nguồn có sẵn miễn phí giúp tiết kiệm chi phí và rút ngắn thời gian xây dựng website."
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://thegioicode.com${router.sources}`} />
                <meta property="og:url" content={`https://thegioicode.com${router.sources}`} />
                <meta property="og:title" content="Thegioicode - Phần mềm mã nguồn" />
                <meta property="og:image" content="https://thegioicode.com/images/FiTPxMPpjZ.png" />
                <meta
                    property="og:description"
                    content="Phần mềm mã nguồn có sẵn miễn phí giúp tiết kiệm chi phí và rút ngắn thời gian xây dựng website."
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
                                    title: 'Mã nguồn',
                                },
                            ]}
                        />
                    </Flex>
                </Col>
                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                        <div className="mb-20 text-center source-header">
                            <h2 className="font-max font-size-24 mb-4 text-uppercase">PHẦN MỀM MÃ NGUỒN</h2>
                            <span className="text-subtitle text-uppercase">
                                CÁC MÃ NGUỒN CÓ SẴN GIÚP TIẾT KIỆM CHI PHÍ VÀ RÚT NGẮN THỜI GIAN XÂY DỰNG
                            </span>
                        </div>

                        <Row
                            style={{ marginLeft: -20, marginRight: -20, rowGap: 40 }}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <Col md={6} xs={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
                                <div className="item-plan-instance">
                                    <div className="border-none">
                                        <Image
                                            width="100%"
                                            className="border"
                                            src="https://i.imgur.com/4mfVdUR.png"
                                            alt="Mã nguồn có phí"
                                            fallback={imageNotFound}
                                            style={{ height: 180, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                        />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-size-19 font-max line-height-22 text-center">MÃ NGUỒN TRẢ PHÍ</h3>
                                    </div>
                                    <a href={router.sources_fees}>
                                        <Button type="primary" className="w-full box-center">
                                            <IconEye size={20} className="mr-1" />
                                            <span>XEM CÁC MẪU</span>
                                        </Button>
                                    </a>
                                </div>
                            </Col>
                            <Col md={6} xs={24} style={{ paddingLeft: 20, paddingRight: 20 }}>
                                <div className="item-plan-instance">
                                    <div className="border-none">
                                        <Image
                                            width="100%"
                                            className="border"
                                            src="https://i.imgur.com/4mfVdUR.png"
                                            alt="Mã nguồn miễn phí"
                                            fallback={imageNotFound}
                                            style={{ height: 180, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                        />
                                    </div>

                                    <div className="py-3 px-2">
                                        <h3 className="font-size-19 font-max line-height-22 text-center">MÃ NGUỒN MIỄN PHÍ</h3>
                                    </div>

                                    <a href={router.sources_free}>
                                        <Button type="primary" className="w-full box-center">
                                            <IconEye size={20} className="mr-1" />
                                            <span>XEM CÁC MẪU</span>
                                        </Button>
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col md={4} xs={24} style={{ padding: '0 8px' }}>
                    <Card
                        title={
                            <div>
                                <h2 className="font-size-20">Mô-đun nâng cao</h2>
                            </div>
                        }
                    >
                        <Empty description="Không có dữ liệu" />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}

export default Source;
