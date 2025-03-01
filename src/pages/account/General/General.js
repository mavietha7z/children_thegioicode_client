import { useSelector } from 'react-redux';
import { Avatar, notification } from 'antd';
import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

import Account from '../Account';
import router from '~/configs/routes';
import GeneralItem from './GeneralItem';
import imageVNFlag from '~/assets/image/vietnam_flag.svg';
import imageEnFlag from '~/assets/image/english_flag.svg';

const itemsLanguage = [
    {
        label: (
            <Fragment>
                <Avatar className="mr-2" src={imageVNFlag} style={{ width: 20, height: 20, lineHeight: 20 }} />
                <span>Việt Nam</span>
            </Fragment>
        ),
        key: '0',
    },
    {
        label: (
            <Fragment>
                <Avatar className="mr-2" src={imageEnFlag} style={{ width: 20, height: 20, lineHeight: 20 }} />
                <span>English</span>
            </Fragment>
        ),
        key: '1',
    },
];

const itemsMode = [
    {
        label: (
            <Fragment>
                <MoonOutlined />
                <span className="ml-1">Chế độ tối</span>
            </Fragment>
        ),
        key: '0',
    },
    {
        label: (
            <Fragment>
                <SunOutlined />
                <span className="ml-1">Chế độ sáng</span>
            </Fragment>
        ),
        key: '1',
    },
];

function General() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Netcode.vn - Cài đặt chung';

        if (!currentUser) {
            navigate(`${router.home}`);
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Account>
            <div className="w-full">
                <h3 className="font-bold font-size-20 border-bottom pb-2 mb-5">Cài đặt chung</h3>

                <div className="d-flex flex-column gap-3">
                    <GeneralItem
                        title="Ngôn ngữ"
                        avatar={imageVNFlag}
                        items={itemsLanguage}
                        name="Việt Nam"
                        description="Tùy chỉnh ngôn ngữ trên thiết bị của bạn."
                    />

                    <GeneralItem
                        title="Chủ đề"
                        items={itemsMode}
                        name="Chế độ sáng"
                        description="Tùy chỉnh giao diện của chủ đề trên thiết bị của bạn."
                    />
                </div>
            </div>
        </Account>
    );
}

export default General;
