import moment from 'moment';
import { Helmet } from 'react-helmet';
import { IconArrowLeft } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, notification, Pagination, Row, Spin } from 'antd';

import router from '~/configs/routes';
import SourceItem from '../SourceItem';
import { convertCurrency } from '~/configs';
import { requestUserGetSources } from '~/services/source';

function SourceCategory() {
    const [pages, setPages] = useState(1);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const navigate = useNavigate();
    const { category } = useParams();
    const { pathname } = useLocation();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetSources(page, category);

            setLoading(false);
            if (result?.status === 200) {
                setPages(result.pages);
                setSources(result.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, category]);

    return (
        <Fragment>
            <Helmet>
                <title>Netcode.vn - Mã nguồn {category === 'free' ? 'miễn phí' : 'trả phí'}</title>
                <meta
                    key="description"
                    name="description"
                    content="Dịch vụ mã nguồn có sẵn giúp tiết kiệm chi phí và rút ngắn thời gian xây dựng website."
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://netcode.vn${pathname}`} />
                <meta property="og:url" content={`https://netcode.vn${pathname}`} />
                <meta property="og:image" content="https://netcode.vn/images/FiTPxMPpjZ.png" />
                <meta property="og:title" content={`Netcode.vn - Mã nguồn ${category === 'free' ? 'miễn phí' : 'trả phí'}`} />
                <meta
                    property="og:description"
                    content="Dịch vụ mã nguồn có sẵn giúp tiết kiệm chi phí và rút ngắn thời gian xây dựng website."
                />
            </Helmet>

            <Row style={{ rowGap: 16 }}>
                <Col span={24}>
                    <Flex className="gap-2 pl-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.sources)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.sources}>Mã nguồn</Link>,
                                },
                                {
                                    title: `Mã nguồn ${category === 'free' ? 'miễn phí' : 'trả phí'}`,
                                },
                            ]}
                        />
                    </Flex>
                </Col>
                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                        <div className="mb-20 text-center source-header">
                            <h2 className="font-max font-size-24 mb-4">MÃ NGUỒN {category === 'free' ? 'MIỄN PHÍ' : 'TRẢ PHÍ'}</h2>
                            <span className="text-subtitle text-uppercase">
                                CÁC PHẦN MỀM CÓ SẴN GIÚP TIẾT KIỆM CHI PHÍ VÀ RÚT NGẮN THỜI GIAN XÂY DỰNG
                            </span>
                        </div>

                        {loading ? (
                            <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                                <Spin />
                            </Flex>
                        ) : (
                            <Fragment>
                                {sources.length > 0 ? (
                                    <Row style={{ marginLeft: -12, marginRight: -12, rowGap: 24 }}>
                                        {sources.map((source) => (
                                            <Col md={6} xs={24} style={{ paddingLeft: 12, paddingRight: 12 }} key={source.id}>
                                                <SourceItem
                                                    id={source.id}
                                                    title={source.title}
                                                    btn_text="Xem chi tiết"
                                                    image_url={source.image_url}
                                                    discount={source.pricing.discount}
                                                    href={`${router.sources}/detail/${source.slug_url}`}
                                                    price={convertCurrency(source.pricing.price)}
                                                    old_price={convertCurrency(source.pricing.old_price)}
                                                    created_at={moment(source.created_at).format('DD/MM/YYYY')}
                                                    view_count={convertCurrency(source.view_count).slice(0, -1)}
                                                    purchase_count={convertCurrency(source.purchase_count).slice(0, -1)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <Flex justify="center">
                                        <Empty description="Danh mục không có sản phẩm nào" />
                                    </Flex>
                                )}
                            </Fragment>
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

export default SourceCategory;
