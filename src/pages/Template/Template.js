import moment from 'moment';
import { Helmet } from 'react-helmet';
import { IconArrowLeft } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, notification, Pagination, Row, Spin } from 'antd';

import router from '~/configs/routes';
import TemplateItem from './TemplateItem';
import { convertCurrency } from '~/configs';
import { requestUserGetTemplates } from '~/services/template';

function Template() {
    const [pages, setPages] = useState(1);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetTemplates(page);

            setLoading(false);
            if (result?.status === 200) {
                setPages(result.pages);
                setTemplates(result.data);
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

    return (
        <Fragment>
            <Helmet>
                <title>Netcode.vn - Dịch vụ tạo website với mẫu có sẵn</title>
                <meta
                    key="description"
                    name="description"
                    content="Thiết kế website theo yêu cầu, tạo website với các mẫu có sẵn với tiêu chí nhanh, gọn, bảo mật, bảo hành trọn đời"
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://netcode.vn${router.templates}`} />
                <meta property="og:url" content={`https://netcode.vn${router.templates}`} />
                <meta property="og:title" content="Netcode.vn - Dịch vụ tạo website với mẫu có sẵn" />
                <meta property="og:image" content="https://netcode.vn/images/mtjuBeolaD.png" />
                <meta
                    property="og:description"
                    content="Thiết kế website theo yêu cầu, tạo website với các mẫu có sẵn với tiêu chí nhanh, gọn, bảo mật, bảo hành trọn đời"
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
                                    title: 'Tạo website',
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                        <div className="mb-20 text-center source-header">
                            <h2 className="font-max font-size-24 mb-4 text-uppercase">MẪU WEBSITE</h2>
                            <span className="text-subtitle text-uppercase">
                                TẠO WEBSITE CHO NGƯỜI KHÔNG CÓ CHUYÊN MÔN VỚI TIÊU CHÍ NHANH - GỌN - BẢO MẬT - BẢO HÀNH TRỌN ĐỜI
                            </span>
                        </div>

                        {loading ? (
                            <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                                <Spin />
                            </Flex>
                        ) : (
                            <Row style={{ marginLeft: -20, marginRight: -20, rowGap: 40 }}>
                                {templates.map((template) => (
                                    <Col md={6} xs={24} style={{ paddingLeft: 20, paddingRight: 20 }} key={template.id}>
                                        <TemplateItem
                                            id={template.id}
                                            title={template.title}
                                            btn_text="Xem chi tiết"
                                            image_url={template.image_url}
                                            view_count={convertCurrency(template.view_count).slice(0, -1)}
                                            create_count={convertCurrency(template.create_count).slice(0, -1)}
                                            discount={template.pricing.discount}
                                            price={convertCurrency(template.pricing.price)}
                                            href={`${router.templates}/detail/${template.slug_url}`}
                                            created_at={moment(template.created_at).format('DD/MM/YYYY')}
                                        />
                                    </Col>
                                ))}
                            </Row>
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

export default Template;
