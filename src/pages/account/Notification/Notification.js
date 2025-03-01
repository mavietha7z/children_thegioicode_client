import { useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { IconCopy } from '@tabler/icons-react';
import { Button, Flex, notification, Tabs, Tooltip } from 'antd';
import { PoweroffOutlined, ShakeOutlined } from '@ant-design/icons';

import Account from '../Account';
import chPlayImage from '~/assets/image/chplay.png';
import appStoreImage from '~/assets/image/appstore.png';

const IsActiveNotification = ({ name }) => {
    return (
        <Flex align="center" className="flex-column mt-2">
            <ShakeOutlined className="text-primary mb-5 mt-4" style={{ fontSize: 60 }} />

            <h3 className="font-bold font-size-18 text-center mb-4">Đăng ký nhận thông báo {name} hiện đã được bật</h3>

            <Button
                type="primary"
                className="min-height-35"
                icon={<PoweroffOutlined />}
                onClick={() => notification.error({ message: 'Thông báo', description: 'Chắc năng đang được phát triển' })}
            >
                Tắt thông báo
            </Button>
        </Flex>
    );
};

const NotActiveNotification = ({ name, id, url }) => {
    return (
        <Fragment>
            {name === 'Email' ? (
                <Flex align="center" className="flex-column mt-2">
                    <ShakeOutlined className="text-primary mb-5 mt-4" style={{ fontSize: 60 }} />

                    <h3 className="font-bold font-size-18 text-center mb-4">Đăng ký nhận thông báo Email hiện đã được bật</h3>

                    <Button
                        type="primary"
                        className="min-height-35"
                        icon={<PoweroffOutlined />}
                        onClick={() => notification.error({ message: 'Thông báo', description: 'Chắc năng đang được phát triển' })}
                    >
                        Tắt thông báo
                    </Button>
                </Flex>
            ) : (
                <Fragment>
                    <h3 className="font-bold font-size-18">Nhận thông báo qua {name}</h3>
                    <div className="text-subtitle">Để đăng ký, làm theo các bước dưới đây:</div>

                    <div className="mt-4">
                        <div className="w-full">
                            <b>- Bước 1: </b>
                            <span>Cài đặt ứng dụng Telegram để nhận thông báo. (Bỏ qua bước này nếu đã cài đặt)</span>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-3">
                            <a href="https://apps.apple.com/vn/app/telegram-messenger/id686449807" target="_blank" rel="noreferrer">
                                <Button size="large" className="box-align-center">
                                    <img src={appStoreImage} alt="App Store" style={{ width: 20 }} />
                                    <span className="ml-2">App Store</span>
                                </Button>
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" target="_blank" rel="noreferrer">
                                <Button size="large" className="box-align-center">
                                    <img src={chPlayImage} alt="Google Play" style={{ width: 20 }} />
                                    <span className="ml-2">Google Play</span>
                                </Button>
                            </a>
                        </div>

                        <div className="w-full mt-4">
                            <b>- Bước 2: </b>
                            <span>
                                Nhấp vào
                                <a className="text-underline mx-1" href={url} target="_blank" rel="noreferrer">
                                    liên kết này
                                </a>
                                để kết nối đến Telegram của chúng tôi.
                            </span>
                        </div>
                        <div className="w-full mt-4">
                            <b>- Bước 3: </b>
                            <span>Gửi tin nhắn cho chúng tôi theo cú pháp sau:</span>

                            <Flex
                                align="center"
                                className="gap-2 rounded-8 px-3 py-2 mt-3 ml-2"
                                style={{ background: '#f2f2f2', maxWidth: 'max-content' }}
                            >
                                <b>#DK {id}</b>
                                <Tooltip title="Sao chép">
                                    <IconCopy size={16} className="cursor-pointer" />
                                </Tooltip>
                            </Flex>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

function Notification() {
    const { configs } = useSelector((state) => state.apps);
    const { currentUser } = useSelector((state) => state.auth);

    const items = currentUser?.notifications.map((item, index) => ({
        key: String(index + 1),
        label: <span>{item.name}</span>,
        children: item.is_active ? (
            <IsActiveNotification name={item.name} />
        ) : (
            <NotActiveNotification name={item.name} id={currentUser?.id} url={configs.contacts.telegram_url} />
        ),
    }));

    useEffect(() => {
        document.title = 'Netcode - Cài đặt thông báo';
    }, []);

    return (
        <Account>
            <div className="w-full">
                <h3 className="font-bold font-size-20 mb-1">Cài đặt thông báo</h3>
                <p className="text-subtitle">
                    Khi bạn đăng ký nhận thông báo, chúng tôi sẽ gửi thông tin về dịch vụ, giao dịch và khuyến mãi,... đến ứng dụng mà bạn
                    đã đăng ký.
                </p>

                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </Account>
    );
}

export default Notification;
