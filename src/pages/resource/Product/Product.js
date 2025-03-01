import { Helmet } from 'react-helmet';
import { IconArrowLeft } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, notification, Pagination, Row, Spin } from 'antd';

import router from '~/configs/routes';
import ProductItem from './ProductItem';
import { convertCurrency } from '~/configs';
import { requestUserGetResourceProducts } from '~/services/resource';

function Product() {
    const [pages, setPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const { slug } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetResourceProducts(page, slug);

            setLoading(false);
            if (result?.status === 200) {
                const { products, ...others } = result.data;

                setProducts(products);
                setPages(result.pages);
                setCategory({ ...others });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, slug]);

    if (!category) {
        return <Empty />;
    }

    return (
        <Fragment>
            <Helmet>
                <title>Thegioicode.com - {category.title}</title>
                <meta
                    key="description"
                    name="description"
                    content="Danh mục tài khoản mmo, tài khoản FB, BM, Zalo, Twitter, Telegram, Instagram, Shopee, Discord, Tiktok..."
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://thegioicode.com${pathname}`} />
                <meta property="og:url" content={`https://thegioicode.com${pathname}`} />
                <meta property="og:title" content={`Thegioicode.com - ${category.title}`} />
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
                                    title: <Link to={router.resources}>Tài khoản</Link>,
                                },
                                {
                                    title: category.title,
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                        <div className="mb-20 text-center source-header">
                            <h2 className="font-max font-size-24 mb-4 text-uppercase">{category.title}</h2>
                            <span className="text-subtitle text-uppercase">{category.description}</span>
                        </div>

                        {loading ? (
                            <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                                <Spin />
                            </Flex>
                        ) : (
                            <Row style={{ marginLeft: -20, marginRight: -20, rowGap: 40 }}>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <Col md={6} xs={24} style={{ paddingLeft: 20, paddingRight: 20 }} key={product.id}>
                                            <ProductItem
                                                quantity={1}
                                                title={product.title}
                                                image_url={product.image_url}
                                                description={product.description}
                                                discount={product.pricing.discount}
                                                old_price={convertCurrency(product.pricing.price)}
                                                inventory={convertCurrency(product.inventory).slice(0, -1)}
                                                view_count={convertCurrency(product.view_count).slice(0, -1)}
                                                purchase_count={convertCurrency(product.purchase_count).slice(0, -1)}
                                                price={convertCurrency(
                                                    product.pricing.price - (product.pricing.price * product.pricing.discount) / 100,
                                                )}
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

export default Product;
