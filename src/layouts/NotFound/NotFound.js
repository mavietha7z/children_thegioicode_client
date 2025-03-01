import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Flex, Result } from 'antd';
import { IconHome } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

import router from '~/configs/routes';

function NotFound({ coming = false }) {
    const { pathname } = useLocation();

    return (
        <Flex align="center" justify="center" className="container h-full">
            {coming ? (
                <Result status="404" subTitle={<strong>Coming soon...</strong>} />
            ) : (
                <Fragment>
                    <Helmet>
                        <title>Thegioicode.com - Trang không tồn tại</title>
                        <meta key="description" name="description" content="URL của nội dung này đã bị thay đổi hoặc không còn tồn tại." />

                        <link rel="canonical" href={`https://thegioicode.com${pathname}`} />
                        <meta property="og:url" content={`https://thegioicode.com${pathname}`} />
                        <meta property="og:image" content="https://thegioicode.com/images/izgdwacbGc.png" />
                        <meta property="og:title" content="Thegioicode.com - Trang không tồn tại" />
                        <meta property="og:description" content="URL của nội dung này đã bị thay đổi hoặc không còn tồn tại." />
                    </Helmet>

                    <Result
                        status="404"
                        title={<h2 className="font-size-26 font-max">Không tìm thấy nội dung 😓</h2>}
                        subTitle={
                            <Fragment>
                                URL của nội dung này đã
                                <strong> bị thay đổi</strong> hoặc <strong>không còn tồn tại</strong>
                                <br />
                                Nếu bạn <strong>đang lưu URL này</strong>, hãy thử <strong>truy cập lại từ trang chủ</strong> thay vì dùng
                                URL đã lưu
                            </Fragment>
                        }
                        extra={
                            <Link to={router.home}>
                                <Button type="primary">
                                    <div className="box-center">
                                        <IconHome stroke={1.3} size={20} />
                                        <span className="ml-1">Quay lại trang chủ</span>
                                    </div>
                                </Button>
                            </Link>
                        }
                    />
                </Fragment>
            )}
        </Flex>
    );
}

export default NotFound;
