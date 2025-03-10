import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Footer } from 'antd/es/layout/layout';
import { isMobile } from 'react-device-detect';
import { IconBrandTelegram, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';

import router from '~/configs/routes';
import imageLogo from '~/assets/image/logo.png';
import imageIconDmca from '~/assets/image/dmca.png';
import imageIconZalo from '~/assets/image/icon-zalo.png';
import imageIconYoutube from '~/assets/image/icon-youtube.svg';
import imageIconFacebook from '~/assets/image/icon-facebook.svg';

function FooterWrapper() {
    const { configs } = useSelector((state) => state.apps);

    return (
        <Footer style={{ backgroundColor: '#091a4b', marginBottom: isMobile ? 76 : 0 }}>
            <div className="footer-tgc">
                <div className="footer-wrapper">
                    <Row>
                        <Col md={8} xs={24}>
                            <div className="title">
                                <Link to={router.home}>
                                    <img src={imageLogo} className="logo" alt="Netcode" />
                                </Link>
                                <div className="d-flex gap-2 mt-4">
                                    <IconMapPin size={20} />
                                    <p className="mb-3">{configs?.contacts?.address}</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <IconPhone size={20} />
                                    <p className="mb-3">{configs?.contacts?.phone_number}</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <IconBrandTelegram size={20} />
                                    <p className="mb-3">@{configs?.contacts?.telegram_url}</p>
                                </div>
                                <div className="d-flex gap-2 mb-4">
                                    <IconMail size={20} />
                                    <p className="mb-3">{configs?.contacts?.email}</p>
                                </div>
                                <a href="/" target="_blank" rel="noreferrer">
                                    <img src={imageIconDmca} alt="" />
                                </a>
                            </div>
                        </Col>
                        <Col md={16} xs={24}>
                            <Row>
                                <Col md={8} xs={24}>
                                    <div className="footer-title">Sản phẩm</div>
                                    <ul>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.public_apis}>Public API</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.sources}>Mã nguồn</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.templates}>Tạo website</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.cloud_server}>Cloud Server</Link>
                                            </p>
                                        </li>
                                    </ul>
                                </Col>
                                <Col md={8} xs={24}>
                                    <div className="footer-title">Về chúng tôi</div>
                                    <ul>
                                        <li>
                                            <p className="mb-3">
                                                <Link to="#">Liên hệ</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to="#">Giới thiệu</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to="#">Cộng tác viên</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.commit}>Cam kết dịch vụ</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.terms}>Điều khoản sử dụng</Link>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                <Link to={router.privacy}>Chính sách bảo mật</Link>
                                            </p>
                                        </li>
                                    </ul>
                                </Col>
                                <Col md={8} xs={24}>
                                    <div className="footer-title">Công Ty TNHH Netcode</div>
                                    <ul>
                                        <li>
                                            <p className="mb-3">
                                                Mã số thuế: <span></span>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                Ngày thành lập: <span>26/04/2024</span>
                                            </p>
                                        </li>
                                        <li>
                                            <p className="mb-3">
                                                Lĩnh vực hoạt động:{' '}
                                                <span>
                                                    Cung cấp dịch vụ internet, giải pháp điện toán đám mây, mã nguồn triển khai website.
                                                </span>
                                            </p>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <div className="footer-bottom">
                                <p>Copyright © 2024 Netcode. All Rights Reserved</p>

                                <div className="footer-icon">
                                    <ul>
                                        <li>
                                            <a href={configs?.contacts?.facebook_url} target="_blank" rel="noreferrer">
                                                <img src={imageIconFacebook} alt="Facebook" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href={`https://zalo.me/${configs?.contacts?.zalo_url}`} target="_blank" rel="noreferrer">
                                                <img src={imageIconZalo} alt="Zalo" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href={configs?.contacts?.youtube_url} target="_blank" rel="noreferrer">
                                                <img src={imageIconYoutube} alt="Youtube" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Footer>
    );
}

export default FooterWrapper;
