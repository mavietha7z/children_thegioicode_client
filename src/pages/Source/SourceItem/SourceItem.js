import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Flex, Image, Skeleton, Tooltip } from 'antd';
import { IconCalendar, IconDownload, IconEye } from '@tabler/icons-react';

import './SourceItem.css';
import imageNotFound from '~/assets/image/image_not.jpg';

function SourceItem({
    id = '',
    price = 0,
    href = '/',
    title = '',
    discount = 0,
    old_price = 0,
    image_url = '',
    view_count = 0,
    target = '_self',
    purchase_count = 0,
    created_at = '1/1/2017',
    btn_text = 'Xem chi tiết',
}) {
    const [visible, setVisible] = useState(false);

    return (
        <Badge.Ribbon text={`#${id}`} placement="start">
            <Badge.Ribbon text={<span>-{discount}%</span>} placement="end" color="red">
                <div className="source__item">
                    <div className="img-slide border-none">
                        <Image
                            width="100%"
                            className="border"
                            src={image_url}
                            alt={title}
                            fallback={imageNotFound}
                            style={{ height: 200, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                            placeholder={<Skeleton active />}
                            preview={{
                                visible,
                                src: image_url,
                                onVisibleChange: (value) => {
                                    setVisible(value);
                                },
                            }}
                        />

                        <Button type="primary" className="slide-button box-center" size="small" onClick={() => setVisible(true)}>
                            <IconEye size={20} />
                        </Button>
                    </div>

                    <div className="p-3">
                        <Tooltip title={title}>
                            <h3 className="font-size-17 font-max line-height-22">{title}</h3>
                        </Tooltip>
                    </div>

                    <div className="source__item-action">
                        <Flex align="center" justify="space-between" className="mb-2 text-subtitle source__item-meta">
                            <span className="font-size-13 box-center" title="Ngày phát hành">
                                <IconCalendar size={18} className="mr-1" />
                                {created_at}
                            </span>
                            <span className="font-size-13 box-center" title="Tổng lượt xem">
                                <IconEye size={18} className="mr-1" />
                                {view_count}
                            </span>
                            <span className="font-size-13 box-center" title="Tổng lượt mua">
                                <IconDownload size={18} className="mr-1" />
                                {purchase_count}
                            </span>
                        </Flex>

                        <div className="border-top my-2"></div>

                        <Flex justify="space-between" align="center" className="px-2">
                            <span className="font-size-18 font-bold text-danger mr-1">{price}</span>
                            <span className="text-subtitle font-size-15 text-line-through">{old_price}</span>
                        </Flex>

                        <Link to={href} target={target}>
                            <Button type="primary" className="text-uppercase w-full mt-2 box-center">
                                <IconEye size={20} />
                                <span className="ml-1">{btn_text}</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </Badge.Ribbon>
        </Badge.Ribbon>
    );
}

export default SourceItem;
