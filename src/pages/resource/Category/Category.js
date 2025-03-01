import { Helmet } from 'react-helmet';
import { IconArrowLeft } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, notification, Pagination, Row, Spin } from 'antd';

import router from '~/configs/routes';
import CategoryItem from './CategoryItem';
import { requestUserGetResourceCategories } from '~/services/resource';

function Category() {
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetResourceCategories(page);

            setLoading(false);
            if (result?.status === 200) {
                setPages(result.pages);
                setCategories(result.data);
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
                <title>Thegioicode.com - Danh mục tài khoản mmo</title>
                <meta
                    key="description"
                    name="description"
                    content="Danh mục tài khoản mmo, tài khoản FB, BM, Zalo, Twitter, Telegram, Instagram, Shopee, Discord, Tiktok..."
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://thegioicode.com${router.resources}`} />
                <meta property="og:url" content={`https://thegioicode.com${router.resources}`} />
                <meta property="og:title" content="Thegioicode.com - Danh mục tài khoản mmo" />
                <meta property="og:image" content="https://thegioicode.com/images/nMWWWxFUPd.png" />
                <meta
                    property="og:description"
                    content="Danh mục tài khoản mmo, tài khoản FB, BM, Zalo, Twitter, Telegram, Instagram, Shopee, Discord, Tiktok..."
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
                                    title: 'Tài khoản',
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                        <div className="mb-20 text-center source-header">
                            <h2 className="font-max font-size-24 mb-4 text-uppercase">TÀI KHOẢN</h2>
                            <span className="text-subtitle text-uppercase">
                                Cam kết sản phẩm được bán ra 1 lần duy nhất trên hệ thống, tránh trường hợp sản phẩm đó được bán nhiều lần
                            </span>
                        </div>

                        {loading ? (
                            <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                                <Spin />
                            </Flex>
                        ) : (
                            <Row style={{ marginLeft: -20, marginRight: -20, rowGap: 40 }}>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Col md={4} xs={12} style={{ paddingLeft: 20, paddingRight: 20 }} key={category.id}>
                                            <CategoryItem
                                                title={category.title}
                                                slug_url={category.slug_url}
                                                image_url={category.image_url}
                                            />
                                        </Col>
                                    ))
                                ) : (
                                    <Col span={24}>
                                        <Flex align="center" justify="center">
                                            <Empty description="Không có dữ liệu tài khoản" />
                                        </Flex>
                                    </Col>
                                )}
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

export default Category;
