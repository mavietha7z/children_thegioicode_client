import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEye } from '@tabler/icons-react';
import { Button, Image, Skeleton } from 'antd';

import './CategoryItem.css';
import imageNotFound from '~/assets/image/image_not.jpg';

function CategoryItem({ title = '', slug_url = '', image_url = '' }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="category-item">
            <div className="category-image">
                <div className="p-4">
                    <Image
                        width="100%"
                        className="border"
                        src={image_url}
                        alt={title}
                        fallback={imageNotFound}
                        style={{ borderRadius: '50%' }}
                        placeholder={<Skeleton active />}
                        preview={{
                            visible,
                            src: image_url,
                            onVisibleChange: (value) => {
                                setVisible(value);
                            },
                        }}
                    />
                </div>

                <Button type="primary" className="slide-button box-center" size="small" onClick={() => setVisible(true)}>
                    <IconEye size={20} />
                </Button>
            </div>

            <div className="py-3 px-2">
                <h3 className="font-size-16 font-max text-center">{title}</h3>
            </div>

            <div className="category-action">
                <Link to={slug_url}>
                    <Button type="primary" className="text-uppercase w-full box-center">
                        <IconEye size={20} />
                        <span className="ml-1">Xem thêm</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default CategoryItem;
