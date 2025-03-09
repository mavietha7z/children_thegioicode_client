import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Row, Table } from 'antd';

import router from '~/configs/routes';

function Commit() {
    const navigate = useNavigate();
    const { configs } = useSelector((state) => state.apps);

    useEffect(() => {
        document.title = 'Netcode.vn - Cam hết dịch vụ';
    }, []);

    const columns = [
        {
            title: 'Thời gian uptime hàng tháng',
            dataIndex: 'uptime',
            key: 'uptime',
        },
        {
            title: 'Thời gian ở trạng thái không sẵn sàng',
            dataIndex: 'ready',
            key: 'ready',
        },
        {
            title: 'Mức phí dịch vụ đền bù',
            dataIndex: 'compensate',
            key: 'compensate',
        },
    ];

    const dataSource = [
        { uptime: 'Ít hơn 99,9% nhưng lớn hơn hoặc bằng 99,0%', ready: '43 phút – 432 phút', compensate: '10%' },
        { uptime: 'Ít hơn 99,0% Toàn bộ dịch vụ của Netcode', ready: 'Lớn hơn 432 phút', compensate: '30%' },
    ];

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
                                title: 'Cam kết dịch vụ',
                            },
                        ]}
                    />
                </Flex>
            </Col>
            <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                    <div className="mb-20 text-center source-header">
                        <h2 className="font-max font-size-24 mb-4 text-uppercase">Cam kết dịch vụ</h2>
                        <span className="text-subtitle text-uppercase">Cam kết dịch vụ</span>
                    </div>

                    <div className="font-size-15 netcode-tgc">
                        <em>
                            <p>
                                <b>Cam kết chất lượng dịch vụ ( Service Level Agreement – SLA )</b> là bản cam kết giữa Netcode và khách
                                hàng của Netcode. SLA quy định trách nhiệm và chính sách hoàn tiền của chúng tôi trong trường hợp chúng tôi
                                không đáp ứng được những cam kết này. Chúng tôi luôn mong muốn các khách hàng có thể cảm thấy thực sự an tâm
                                và quyết định dễ dàng trong việc sử dụng các dịch vụ của chúng tôi.
                            </p>
                        </em>

                        <p>
                            <b>Các điều khoản cam kết của SLA:</b>
                        </p>
                        <ul>
                            <li>Cam kết về tính sẵn sàng của hệ thống</li>
                            <li>Bảo trì hệ thống định kỳ</li>
                            <li>Các trường hợp loại trừ</li>
                        </ul>

                        <h2>1. Cam kết về tính sẵn sàng của hệ thống</h2>
                        <ul>
                            <li>
                                Netcode cam kết dùng hết nỗ lực của mình đảm bảo thời gian uptime hàng tháng của hệ thống luôn sẵn sàng tối
                                thiểu ở mức 99,9% trong suốt một chu kỳ thanh toán theo cam kết dịch vụ. Trong trường hợp Netcode không đáp
                                ứng được cam kết trên, khách hàng có đầy đủ điều kiện để nhận lại phí dịch vụ theo cam kết dưới đây.
                            </li>
                            <li>
                                Các định nghĩa:
                                <ul>
                                    <li>
                                        “Thời gian uptime hàng tháng” được tính bằng cách lấy 100% số phút trong tháng trừ đi phần trăm số
                                        phút thời gian hệ thống ở “trạng thái không sẵn sàng”. Thời gian uptime hàng tháng không bao gồm
                                        thời gian bảo trì và các trường hợp loại trừ được quy định ở Điều 2 và Điều 3 trong cam kết dịch vụ.
                                        Chỉ những vấn đề phát sinh từ phía chúng tôi như: hư hỏng thiết bị phần cứng, thiết bị mạng, ổ cứng
                                        và nguồn điện mới được coi là lỗi từ chúng tôi. Các vấn đề khác liên quan đến việc quản lý máy chủ
                                        ảo cũng như các phần mềm chạy bên trong máy chủ ảo được xem là lỗi của khách hàng và không được xem
                                        xét đến trong cam kết.
                                    </li>
                                    <li>“Trạng thái không sẵn sàng” là trạng thái server của khách hàng không thể kết nối ra bên ngoài.</li>
                                </ul>
                            </li>
                        </ul>

                        <p>
                            <b>Cam kết đền bù phí dịch vụ:</b>
                        </p>
                        <Table
                            columns={columns}
                            dataSource={dataSource.map((data, index) => ({ key: index, ...data }))}
                            pagination={false}
                            bordered
                            className="mb-4"
                        />
                        <ul>
                            <li>Netcode chỉ áp dụng mức phí đền bù dịch vụ đối với các khoản thanh toán từ khách hàng.</li>
                            <li>
                                Phí đền bù dịch vụ sẽ được cộng vào số dư tài khoản (balance) để sử dụng cho các kỳ thanh toán tiếp theo.
                            </li>
                            <li>Phí đền bù dịch vụ không được hoàn trả lại bằng tiền mặt.</li>
                            <li>Phí đền bù dịch vụ không được chuyển nhượng hoặc áp dụng cho tài khoản khác.</li>
                        </ul>

                        <p>
                            <b>Yêu cầu bồi thường và thủ tục giải quyết:</b>
                        </p>
                        <ul>
                            <li>
                                Để yêu cầu bồi thường trong các trường hợp Netcode không đạt được cam kết, khách hàng vui lòng email đến địa
                                chỉ <a href={`mailto:${configs?.contacts?.email}`}>{configs?.contacts?.email}</a> Nếu yêu cầu bồi thường là
                                hợp lệ, khoản tiền đền bù cho quý khách sẽ được cộng vào tài khoản balance để sử dụng cho các lần thanh toán
                                sau.
                            </li>
                            <li>
                                Yêu cầu bồi thường hợp lệ sẽ bao gồm các thông tin sau:
                                <ul>
                                    <li>Tiêu đề mail ghi rõ “Yêu cầu bồi thường theo cam kết SLA”</li>
                                    <li>Ngày và giờ cụ thể các thời điểm trạng thái không sẵn sàng.</li>
                                    <li>Tài khoản và IP của các instance bị ảnh hưởng.</li>
                                    <li>
                                        Logs ghi lỗi hoặc hình ảnh chụp lại màn hình thời điểm xảy ra lỗi ( Lưu ý: các thông tin bảo mật
                                        nhạy cảm cần được xóa mờ hoặc thay bằng các dấu hoa thị).
                                    </li>
                                    <li>Các yêu cầu bồi thường không cung cấp được các thông tin trên sẽ không được chấp nhận hợp lệ.</li>
                                </ul>
                            </li>
                        </ul>

                        <h2>2. Bảo trì hệ thống định kỳ</h2>
                        <p>
                            Bảo trì hệ thống là công việc bắt buộc thực hiện để đảm bảo tính liên tục của dịch vụ được cung cấp đến Khách
                            hàng. Việc bảo trì có thể được lên kế hoạch thực hiện vào bất kỳ ngày nào trong tuần (bao gồm cả ngày cuối tuần)
                            và có thể vào bất kỳ thời điểm nào trong ngày. Tuy nhiên, Netcode sẽ nỗ lực hết sức để tiến hành việc bảo trì ở
                            các thời điểm ít ảnh hưởng đến việc sử dụng dịch vụ của Khách hàng nhất. Việc bảo trì hệ thống sẽ được Netcode
                            tiến hành theo cách như sau:
                        </p>
                        <ul>
                            <li>
                                Những bảo trì không ảnh hưởng tới hoạt động server của khách hàng sẽ được tiến hành bất cứ ngày nào mà không
                                cần thông báo trước.
                            </li>
                            <li>
                                Những bảo trì ảnh hưởng tới hoạt động server của khách hàng sẽ được thông báo trước:
                                <ul>
                                    <li>
                                        48 giờ so với thời điểm bắt đầu bảo trì bằng hình thức email hoặc thông báo trên website Netcode.vn
                                        với những bảo trì định kỳ.
                                    </li>
                                    <li>
                                        Ít nhất 15 phút trước thời điểm bắt đầu bảo trì bằng hình thức email hoặc điện thoại với những bảo
                                        trì khẩn cấp.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <p>Tổng thời gian bảo trì ảnh hưởng tới hoạt động server của khách hàng trong 1 tháng không quá 2 giờ.</p>

                        <h2>3. Các trường hợp loại trừ</h2>
                        <p>Netcode sẽ không chịu trách nhiệm đền bù trong các trường hợp sau:</p>
                        <ul>
                            <li>Các trường hợp bị tạm dừng hoặc chấm dứt sử dụng được quy định trong mục 5 của điều khoản sử dụng.</li>
                            <li>
                                Các trường hợp gây ra bởi các yếu tố ngoài tầm kiểm soát của chúng tôi như chiến tranh, hỏa hoạn, lũ lụt,
                                khủng bổ, cấm vận, yêu cầu của cơ quan quản lý nhà nước, các tấn công DNS hoặc các sự cố mạng quốc gia.
                            </li>
                            <li>
                                Các trường hợp mà nguyên nhân phát sinh liên quan đến việc quản lý, vận hành server và các phần mềm, ứng
                                dụng chạy trên server do khách hàng thực hiện hoặc bên thứ ba tham gia thực hiện.
                            </li>
                            <li>
                                Các trường hợp mà nguyên nhân phát sinh liên quan đến việc quản lý, vận hành server và các phần mềm, ứng
                                dụng chạy trên server do khách hàng thực hiện hoặc bên thứ ba tham gia thực hiện.
                            </li>
                            <li>
                                Bạn có bất cứ thắc mắc, yêu cầu về việc vi phạm cam kết hoặc đền bù, vui lòng liên hệ chúng tôi qua các
                                thông tin sau:
                                <ul>
                                    <li>
                                        <em>
                                            Hotline:{' '}
                                            <a href={`tel:${configs?.contacts?.phone_number}`}>{configs?.contacts?.phone_number}</a>
                                        </em>
                                    </li>
                                    <li>
                                        <em>
                                            Telegram:{' '}
                                            <a href={`https://t.me/${configs?.contacts?.phone_number}`} target="_blank" rel="noreferrer">
                                                @{configs?.contacts?.telegram_url}
                                            </a>
                                        </em>
                                    </li>
                                    <li>
                                        <em>
                                            Email: <a href={`mailto:${configs?.contacts?.email}`}>{configs?.contacts?.email}</a>
                                        </em>
                                    </li>
                                </ul>
                            </li>
                        </ul>
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

export default Commit;
