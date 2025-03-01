import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

import router from '~/configs/routes';
import NotFound from '~/layouts/NotFound';

function ProxyServer() {
    return (
        <Fragment>
            <Helmet>
                <title>Netcode.vn - Dịch vụ Proxy Server</title>
                <meta key="description" name="description" content="Dịch vụ proxy server, proxy xoay, proxy rotating..." />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://netcode.vn${router.proxy_server}`} />
                <meta property="og:url" content={`https://netcode.vn${router.proxy_server}`} />
                <meta property="og:title" content="Netcode.vn - Dịch vụ Proxy Server" />
                <meta property="og:image" content="https://netcode.vn/images/nMWWWxFUPd.png" />
                <meta property="og:description" content="Dịch vụ proxy server, proxy xoay, proxy rotating..." />
            </Helmet>

            <NotFound coming />
        </Fragment>
    );
}

export default ProxyServer;
