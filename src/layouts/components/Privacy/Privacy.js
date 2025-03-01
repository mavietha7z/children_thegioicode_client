import { useEffect } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Row } from 'antd';

import router from '~/configs/routes';

function Privacy() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Netcode.vn - Chính sách bảo mật';
    }, []);

    return (
        <Row style={{ rowGap: 16 }}>
            <Col span={24}>
                <Flex className="gap-2 pl-2">
                    <Button size="small" className="box-center" onClick={() => navigate(router.home)}>
                        <IconArrowLeft size={18} />
                    </Button>
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to={router.home}>Trang chủ</Link>,
                            },
                            {
                                title: 'Chính sách bảo mật',
                            },
                        ]}
                    />
                </Flex>
            </Col>
            <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                    <div className="mb-20 text-center source-header">
                        <h2 className="font-max font-size-24 mb-4 text-uppercase">Chính sách bảo mật</h2>
                        <span className="text-subtitle text-uppercase">Chính sách bảo mật</span>
                    </div>

                    <div className="font-size-15 netcode-tgc">
                        <em>
                            <p>
                                <b>
                                    Bảo mật thông tin cá nhân là mối quan tâm hàng đầu của mọi khách hàng, do đó vấn đề bảo mật thông tin cá
                                    nhân luôn được Netcode đề cao và đưa lên hàng đầu. Những thông tin cá nhân Netcode thu thập sẽ được giữ
                                    kín và bảo mật dựa trên các nguyên tắc được nêu trong chính sách bảo mật.
                                </b>
                            </p>
                            <p>
                                <b>
                                    Khi khách hàng truy cập và sử dụng hệ thống Netcode (bao gồm cả việc đăng ký dịch vụ trực tuyến),
                                    Netcode hiểu rằng khách hàng đã hoàn toàn đồng ý với những điều khoản của chính sách bảo mật này.
                                </b>
                            </p>
                        </em>

                        <div className="mt-5">
                            <h2>1. Thông tin cá nhân do khách hàng cung cấp</h2>
                            <ul>
                                <li>
                                    Khi khách hàng cung cấp các thông tin cần thiết, Netcode sẽ sử dụng các thông tin đó để đáp ứng yêu cầu
                                    của khách hàng, hoặc Netcode có thể liên lạc với khách hàng qua email, tin nhắn, điện thoại để giới
                                    thiệu đến khách hàng những sản phẩm – dịch vụ mới, chương trình khuyến mãi mới từ Netcode. Đồng thời,
                                    khi cung cấp thông tin cho Netcode cũng có nghĩa rằng khách hàng đã hiểu rõ và chấp thuận việc thu thập,
                                    sử dụng những thông tin cá nhân nêu trên cho một số mục đích của hệ thống Netcode.
                                </li>
                                <li>
                                    Những thông tin khách hàng cung cấp sẽ được lưu trữ tại cơ sở dữ liệu của Netcode, điều này đồng nghĩa
                                    với việc khách hàng đã hoàn toàn đồng ý và chấp thuận việc thông tin cá nhân khách hàng cung cấp cho
                                    Netcode sẽ được lưu trữ lại trên hệ thống.
                                </li>
                                <li>
                                    Nếu khách hàng đăng ký sử dụng sản phẩm – dịch vụ của Netcode hoặc gửi thư phản hồi, Netcode có thể liên
                                    hệ với khách hàng để yêu cầu bổ sung những thông tin cần thiết cho việc xử lý hoặc hoàn thành yêu cầu
                                    của khách hàng, và các thông tin cá nhân này sẽ được bảo mật, Netcode sẽ không cung cấp thông tin này
                                    cho một bên thứ ba nếu không được sự cho phép của khách hàng, trừ trường hợp bị pháp luật hiện hành bắt
                                    buộc.
                                </li>
                                <li>
                                    Netcode cam kết bảo vệ các thông tin cá nhân của khách hàng, không mua bán thông tin cá nhân của khách
                                    hàng cho các công ty khác vì bất kỳ mục đích gì.
                                </li>
                            </ul>

                            <h2>2. Sử dụng thông tin cá nhân</h2>
                            <p>Netcode có thể sử dụng thông tin cá nhân của khách hàng trong các trường hợp cụ thể sau:</p>
                            <ul>
                                <li>Xác nhận thanh toán và hỗ trợ dịch vụ</li>
                                <li>Thông báo gia hạn dịch vụ đến khách hàng</li>
                                <li>Giới thiệu về các sản phẩm – dịch vụ mới của Netcode</li>
                                <li>
                                    Thông báo các chương trình khuyến mãi hoặc cung cấp các thông tin khác qua e-mail. Nếu không muốn nhận
                                    e-mail, khách hàng có thể từ chối nhận e-mail bất cứ lúc nào bằng cách liên hệ lại với Netcode qua hệ
                                    thống support
                                </li>
                                <li>Các chương trình khảo sát nhằm nâng cao chất lượng dịch vụ</li>
                            </ul>

                            <h2>3. Thông tin qua e-mail</h2>
                            <ul>
                                <li>
                                    Khi đăng ký dịch vụ, địa chỉ e-mail khách hàng cung cấp sẽ được dùng làm công cụ trao đổi thông tin với
                                    khách hàng. Do đó, khách hàng cần chắc chắn địa chỉ e-mail khách hàng đã cung cấp là hữu dụng đối với
                                    khách hàng trong suốt quá trình sử dụng dịch vụ.
                                </li>
                                <li>
                                    Netcode có thể gửi những thông tin bí mật qua e-mail hay tiếp nhận yêu cầu hỗ trợ của khách hàng. Trong
                                    trường hợp khách hàng không còn sử dụng e-mail đã cung cấp, khách hàng phải báo lại cho Cloud về việc
                                    thay đổi này.
                                </li>
                                <li>
                                    Để bảo vệ các thông tin cá nhân của khách hàng, Netcode có thể tạm thời ngưng tiếp nhận yêu cầu qua
                                    e-mail khách hàng đã cung cấp nếu nhận thấy có sự gian lận hoặc thông tin bất thường cho đến khi Netcode
                                    liên hệ được với khách hàng để xác nhận.
                                </li>
                            </ul>

                            <h2>4. Điều chỉnh thông tin thu thập</h2>
                            <ul>
                                <li>
                                    Netcode sẽ chủ động hoặc theo yêu cầu khách hàng để bổ sung, hiệu chỉnh các dữ liệu thông tin cá nhân
                                    không chính xác, không đầy đủ hoặc không cập nhật khi khách hàng còn liên kết với hoạt động của Netcode.
                                </li>
                            </ul>

                            <h2>5. Các đường liên kết ngoài trang web của Netcode</h2>
                            <ul>
                                <li>
                                    Trang web của Netcode có thể chứa các đường liên kết đến các trang web khác được đặt vào nhằm mục đích
                                    giới thiệu hoặc bổ sung thông tin liên quan để khách hàng tham khảo. Netcode không chịu trách nhiệm về
                                    nội dung hay các hành vi của bất kỳ trang web nào khác.
                                </li>
                            </ul>

                            <h2>6. Bảo mật thông tin của khách hàng</h2>
                            <ul>
                                <li>
                                    Vì luôn có những rủi ro liên quan đến vấn đề cung cấp dữ liệu cá nhân (dù là cung cấp trực tiếp, qua
                                    điện thoại, qua mạng internet hay qua các phương tiện kỹ thuật khác) và không có hệ thống kỹ thuật nào
                                    an toàn tuyệt đối hay chống được tất cả các “hacker” và “tamper” (người xâm nhập trái phép để lục lọi
                                    thông tin), Netcode luôn nỗ lực tiến hành những biện pháp an ninh thích hợp đối với từng đặc tính của
                                    thông tin để ngăn chặn và giảm thiểu tối đa các rủi ro có thể khi khách hàng sử dụng hệ thống Netcode.
                                </li>
                                <li>
                                    Với mục đích nhằm bảo mật và bảo vệ tính toàn vẹn thông tin, đảm bảo tính thông suốt của hệ thống mạng,
                                    Netcode sẽ lưu trữ thông tin cá nhân và thông tin thanh toán của khách hàng trong một định dạng an toàn
                                    đã được mã hóa và chỉ có riêng đội ngũ nhân viên được ủy quyền của Netcode mới có quyền truy cập các
                                    thông tin này.
                                </li>
                                <li>
                                    Netcode sẽ không cung cấp thông tin cá nhân của khách hàng cho bất kỳ ai, ngoại trừ:
                                    <ul>
                                        <li>Các yêu cầu của cơ quan thi hành pháp luật hoặc cơ quan quản lý có thẩm quyền</li>
                                        <li>
                                            Bên thứ ba đại diện cho Netcode thực hiện các dịch vụ thanh toán với cam kết sẽ bảo mật thông
                                            tin cá nhân của khách hàng
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <p>
                                <b>Lưu ý:</b>
                            </p>
                            <ul>
                                <li>
                                    Chính sách bảo mật này không nhằm mục đích tạo ra một hợp đồng hay các quyền lợi có tính chất pháp lý
                                    cho bất kỳ một đối tác thứ ba nào.
                                </li>
                                <li>
                                    Netcode có thể thay đổi, sửa đổi, bổ sung hoặc thay thế nội dung chính sách riêng tư bất cứ khi nào nhằm
                                    phù hợp với quy định của pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam. Mọi thay đổi có hiệu lực kể
                                    từ khi được công bố trên website <Link to={router.home}>Netcode.vn</Link>.
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </Col>

            <Col md={4} xs={24} style={{ padding: '0 8px' }}>
                <Card
                    title={
                        <div>
                            <h2 className="font-size-20">Mô-đun nâng cao</h2>
                        </div>
                    }
                >
                    <Empty description="Không có dữ liệu" />
                </Card>
            </Col>
        </Row>
    );
}

export default Privacy;
