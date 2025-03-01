import { Badge } from 'antd';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import './PublicAPIItem.css';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import IconQuestion from '~/assets/icon/IconQuestion';
import imageNotFound from '~/assets/image/image_not.jpg';

function PublicAPIItem({ status, image_url = imageNotFound, title, description, price, old_price, slug_url }) {
    let statusRibbon = '';
    let statusColor = '';
    if (status === 'activated') {
        statusRibbon = 'Hoạt động';
        statusColor = 'green';
    }
    if (status === 'maintenance') {
        statusRibbon = 'Đang bảo trì';
        statusColor = 'orange';
    }
    if (status === 'blocked') {
        statusRibbon = 'Không hoạt động';
        statusColor = 'red';
    }

    return (
        <Badge.Ribbon text={<span className="font-size-12">{statusRibbon}</span>} color={statusColor} placement="start">
            <Badge.Ribbon
                text={
                    <div className="mt-1">
                        <IconQuestion width={16} height={16} className="text-subtitle mr-3" title={description} />
                    </div>
                }
                color="transparent"
            >
                <div className="api-item">
                    <div className="api-item_header">
                        <img src={image_url} alt={title} />
                        <div className="api-item_mask"></div>
                        <Link to={router.public_apis + `/${slug_url}`} className="api-item_link">
                            <span></span>
                            <span></span>
                            <span></span>
                        </Link>
                    </div>
                    <div className="api-item_body">
                        <Link to={router.public_apis + `/${slug_url}`}>
                            <h5 className="api-item_title text-uppercase font-size-13" title={title}>
                                {title}
                            </h5>
                        </Link>
                    </div>
                    <div className="api-item-price">
                        {price === 0 ? (
                            <span className="text-success ml-1 line-height-12 font-semibold">Miễn phí</span>
                        ) : (
                            <Fragment>
                                <span className="text-subtitle text-line-through mr-1 line-height-12 font-semibold">
                                    {convertCurrency(old_price)}
                                </span>
                                /<span className="text-success ml-1 line-height-12 font-semibold">{convertCurrency(price)}</span>
                            </Fragment>
                        )}
                    </div>
                </div>
            </Badge.Ribbon>
        </Badge.Ribbon>
    );
}

export default PublicAPIItem;
