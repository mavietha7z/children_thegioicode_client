import 'swiper/css';
import { Button } from 'antd';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import { useEffect, useState } from 'react';
import { IconEye } from '@tabler/icons-react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Fancybox from './Fancybox';
import { checkImage } from '~/configs';
import imageNotFound from '~/assets/image/image_not.jpg';

function SlideImage({ images = [] }) {
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        images.forEach((image) => {
            checkImage(image)
                .then((url) => {
                    setImageUrls((prevUrls) => ({ ...prevUrls, [image]: url }));
                })
                .catch(() => {
                    setImageUrls((prevUrls) => ({ ...prevUrls, [image]: imageNotFound }));
                });
        });
    }, [images]);

    return (
        <Fancybox
            options={{
                Carousel: {
                    infinite: false,
                },
            }}
        >
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                pagination={{ clickable: true }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 40,
                    },
                }}
                modules={[Pagination]}
                className="theme-swiper"
            >
                {images.map((image, index) => (
                    <SwiperSlide style={{ width: 300, marginRight: 10 }} key={index}>
                        <div className="img-slide" data-fancybox="gallery" data-src={imageUrls[image] || image}>
                            <img src={imageUrls[image] || image} alt="Ảnh DEMO" />
                            <Button type="primary" className="slide-button box-center" size="small">
                                <IconEye size={20} />
                            </Button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Fancybox>
    );
}

export default SlideImage;
