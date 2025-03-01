import { Helmet } from 'react-helmet';
import { IconArrowLeft } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Row, Spin, notification } from 'antd';

import router from '~/configs/routes';
import { generateCateString } from '~/configs';
import { requestUserGetApiBySlug } from '~/services/apis';

function PublicAPIDetail() {
    const [api, setApi] = useState(null);
    const [loading, setLoading] = useState(false);

    const { slug } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (slug) {
            const fetch = async () => {
                setLoading(true);
                const result = await requestUserGetApiBySlug(slug);

                setLoading(false);
                if (result?.status === 200) {
                    setApi(result.data);
                } else {
                    navigate(router.public_apis);
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
            };
            fetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    return (
        <Fragment>
            {api && (
                <Helmet>
                    <title>Netcode.vn - {api.title}</title>
                    <meta key="description" name="description" content={`${generateCateString(api.description, 117)}`} />

                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href={`https://netcode.vn${pathname}`} />
                    <meta property="og:url" content={`https://netcode.vn${pathname}`} />
                    <meta property="og:image" content={`${api.image_url}`} />
                    <meta property="og:title" content={`Netcode.vn - ${api.title}`} />
                    <meta property="og:description" content={`${generateCateString(api.description, 117)}`} />
                </Helmet>
            )}

            <Row style={{ rowGap: 16 }}>
                <Col span={24}>
                    <Flex className="gap-2 pl-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.public_apis)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.public_apis}>Public API</Link>,
                                },
                                {
                                    title: api?.title,
                                },
                            ]}
                        />
                    </Flex>
                </Col>
                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card className="api-detail">
                        {!loading && api ? (
                            <Fragment>
                                <h1 className="font-size-22 text-uppercase font-max">
                                    {api.title} - <span className="text-danger font-size-20">{api.version}</span>
                                </h1>
                                <div className="text-subtitle">
                                    <span>{api.description}</span>
                                </div>

                                <div className="api-document" dangerouslySetInnerHTML={{ __html: api.document_html }}></div>
                            </Fragment>
                        ) : (
                            <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                                <Spin />
                            </Flex>
                        )}
                    </Card>
                </Col>

                <Col md={4} xs={24} style={{ padding: '0 8px' }}>
                    <Card
                        title={
                            <div>
                                <h2 className="font-size-20">Lịch sử cập nhật</h2>
                            </div>
                        }
                    >
                        <Empty description="Chưa có bản cập nhật nào" />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}

export default PublicAPIDetail;
