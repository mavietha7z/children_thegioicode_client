import { Space } from 'antd';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { IconServer2 } from '@tabler/icons-react';

import Image from './Image';
import Order from './Order';
import Renew from './Renew';
import Region from './Region';
import Deploy from './Deploy';
import Action from './Action';
import Resize from './Resize';
import Product from './Product';
import Rebuild from './Rebuild';
import Document from '../Document';
import RenewInfo from './RenewInfo';
import router from '~/configs/routes';
import ResizeInfo from './ResizeInfo';
import OrderDetail from './OrderDetail';

function CloudServer() {
    return (
        <Fragment>
            <Helmet>
                <title>Thegioicode.com - API Cloud server, Cloud VPS</title>
                <meta
                    key="description"
                    name="description"
                    content="API document này giúp lấy danh sách dịch vụ Cloud Server, Cloud VPS, khởi tạo và quản lý dịch vụ Cloud Server, Cloud VPS"
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://thegioicode.com${router.document}`} />
                <meta property="og:url" content={`https://thegioicode.com${router.document}`} />
                <meta property="og:title" content="Thegioicode.com - API Cloud server, Cloud VPS" />
                <meta property="og:image" content="https://thegioicode.com/images/izgdwacbGc.png" />
                <meta
                    property="og:description"
                    content="API document này giúp lấy danh sách dịch vụ Cloud Server, Cloud VPS, khởi tạo và quản lý dịch vụ Cloud Server, Cloud VPS"
                />
            </Helmet>

            <Document
                keyTab="2"
                label={
                    <span className="box-align-center gap-2 text-subtitle">
                        <IconServer2 width={20} height={20} />
                        Cloud Server
                    </span>
                }
            >
                <div className="api-detail">
                    <Space direction="vertical" className="w-full">
                        <Region />

                        <Image />

                        <Product />

                        <Deploy />

                        <Order />

                        <OrderDetail />

                        <RenewInfo />

                        <Renew />

                        <Action />

                        <Rebuild />

                        <ResizeInfo />

                        <Resize />
                    </Space>
                </div>
            </Document>
        </Fragment>
    );
}

export default CloudServer;
