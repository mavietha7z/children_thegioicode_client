import { Button } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';

import './WidgetChat.css';
import imageZalo from '~/assets/image/zalo.png';
import imageTelegram from '~/assets/image/telegram.png';
import imageFacebook from '~/assets/image/facebook.png';

function WidgetChat() {
    const [open, setOpen] = useState(false);

    const { configs } = useSelector((state) => state.apps);

    return (
        <div className="widget-wrapper">
            <div className={`widget-container ${open ? 'd-flex' : ''}`}>
                <div className="widget-header">
                    <h4 className="widget-title">Chăm sóc khách hàng</h4>
                    <button className="widget-close">
                        <CloseOutlined width={16} height={16} />
                    </button>
                </div>

                <div className="widget-panel">
                    <div className="widget-panel-register">
                        <div className="form-register">
                            <a href={`https://zalo.me/${configs?.contacts?.zalo_url}`} target="_blank" rel="noreferrer">
                                <Button size="large" className="rounded-10 min-height-45 w-full mb-4 box-center">
                                    <img src={imageZalo} alt="Zalo" className="mr-2" />
                                    <span>Chat qua Zalo</span>
                                </Button>
                            </a>
                            <a href={configs?.contacts?.facebook_url} target="_blank" rel="noreferrer">
                                <Button size="large" className="rounded-10 min-height-45 w-full mb-4 box-center">
                                    <img src={imageFacebook} alt="Message" className="mr-2" />
                                    <span>Chat qua Facebook</span>
                                </Button>
                            </a>
                            <a href={`https://t.me/${configs?.contacts?.telegram_url}`} target="_blank" rel="noreferrer">
                                <Button size="large" className="rounded-10 min-height-45 w-full mb-4 box-center">
                                    <img src={imageTelegram} alt="Telegram" className="mr-2" />
                                    <span>Chat qua Telegram</span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-widget">
                <div className={`toggle-widget ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}></div>
            </div>
        </div>
    );
}

export default WidgetChat;
