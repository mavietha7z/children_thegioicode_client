import { Helmet } from 'react-helmet';
import { IconArrowLeft } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Pagination, Row, Spin, notification } from 'antd';

import router from '~/configs/routes';
import PublicAPIItem from './PublicAPIItem';
import { requestUserGetApis } from '~/services/apis';

function PublicAPI() {
    const [apis, setApis] = useState([]);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetApis(page);

            setLoading(false);
            if (result?.status === 200) {
                setPages(result.pages);
                setApis(result.data);
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
                <title>Thegioicode.com - Danh mục Public API</title>
                <meta
                    key="description"
                    name="description"
                    content="Dịch vụ API giúp tiếp cận nhiều chức năng cho website, thuận tiện cho công việc của bạn..."
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://thegioicode.com${router.public_apis}`} />
                <meta property="og:url" content={`https://thegioicode.com${router.public_apis}`} />
                <meta property="og:title" content="Thegioicode.com - Danh mục Public API" />
                <meta property="og:image" content="https://thegioicode.com/images/dLdWzlYEiC.png" />
                <meta
                    property="og:description"
                    content="Dịch vụ API giúp tiếp cận nhiều chức năng cho website, thuận tiện cho công việc của bạn..."
                />
            </Helmet>

            <Row style={{ rowGap: 16 }}>
                <Col span={24}>
                    <Flex className="gap-2 pl-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.home)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },

                                {
                                    title: 'Public API',
                                },
                            ]}
                        />
                    </Flex>
                </Col>
                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                        <div className="mb-20 text-center source-header">
                            <h2 className="font-max font-size-24 mb-4 text-uppercase">PUBLIC API</h2>
                            <span className="text-subtitle text-uppercase">
                                Cung cấp api giúp tiếp cận nhiều chức năng cho website của bạn
                            </span>
                        </div>

                        {loading ? (
                            <Flex align="center" justify="center" style={{ minHeight: '79vh' }}>
                                <Spin />
                            </Flex>
                        ) : (
                            <Fragment>
                                {apis.length > 0 ? (
                                    <Row style={{ margin: '0 -8px', rowGap: 16 }}>
                                        {apis.map((api, index) => (
                                            <Col md={4} xs={12} style={{ padding: '0 8px' }} key={index}>
                                                <PublicAPIItem
                                                    image_url={api.image_url}
                                                    old_price={api.old_price}
                                                    price={api.price}
                                                    slug_url={api.slug_url}
                                                    title={api.title}
                                                    description={api.description}
                                                    status={api.status}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <Flex justify="center">
                                        <Empty description="Không có dữ liệu" />
                                    </Flex>
                                )}
                            </Fragment>
                        )}

                        {Number(pages) > 1 && (
                            <Flex justify="end" className="mt-3">
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

export default PublicAPI;
