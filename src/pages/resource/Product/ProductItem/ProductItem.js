import { useState } from 'react';
import { Badge, Button, Flex, Image, Input, Skeleton, Space } from 'antd';
import { IconBasket, IconDownload, IconEye, IconMinus, IconPlus, IconShoppingCartPlus } from '@tabler/icons-react';

import './ProductItem.css';
import imageNotFound from '~/assets/image/image_not.jpg';

function ProductItem({
    price = 0,
    title = '',
    discount = 0,
    quantity = 1,
    inventory = 0,
    old_price = 0,
    image_url = '',
    view_count = 0,
    description = '',
    purchase_count = 0,
}) {
    const [visible, setVisible] = useState(false);

    return (
        <Badge.Ribbon text={<span>-{discount}%</span>} placement="end" color="red">
            <div className="product_item">
                <div className="product_image border-none">
                    <Image
                        width="100%"
                        className="border"
                        src={image_url}
                        alt={title}
                        fallback={imageNotFound}
                        style={{ height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
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

                <div className="pt-3 px-3">
                    <h3 className="font-size-17 font-max line-height-22 text-center" title={title}>
                        {title}
                    </h3>
                    <p className="text-subtitle mt-2 product_desc" title={description}>
                        {description}
                    </p>
                </div>

                <div className="product_item-action border-top">
                    <Flex align="center" justify="space-between" className="text-subtitle product_item-meta">
                        <span className="font-size-13 box-center" title="Tồn kho">
                            <IconBasket size={18} className="mr-1" />
                            {inventory}
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

                    <Flex justify="space-between" align="center" className="py-2">
                        <span className="font-size-18 font-bold text-danger mr-1">{price}</span>
                        <span className="text-subtitle font-size-15 text-line-through">{old_price}</span>
                    </Flex>
                    <Flex justify="center" align="center">
                        <Space.Compact style={{ width: '100%', maxWidth: 170 }}>
                            <Button size="middle" className="box-center">
                                <IconMinus size={24} />
                            </Button>
                            <Input size="middle" value={quantity} classNames={{ input: 'text-center' }} />
                            <Button size="middle" className="box-center">
                                <IconPlus size={24} />
                            </Button>
                        </Space.Compact>
                    </Flex>

                    <Button type="primary" className="text-uppercase w-full mt-3 box-center">
                        <IconShoppingCartPlus size={20} />
                        <span className="text-uppercase ml-1">Giỏ hàng</span>
                    </Button>
                </div>
            </div>
        </Badge.Ribbon>
    );
}

export default ProductItem;
