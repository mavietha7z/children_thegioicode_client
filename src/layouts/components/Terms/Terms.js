import { useEffect } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Row } from 'antd';

import router from '~/configs/routes';

function Terms() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Thegioicode.com - Điều khoản sử dụng';
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
                                title: 'Điều khoản sử dụng',
                            },
                        ]}
                    />
                </Flex>
            </Col>
            <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                <Card style={{ minHeight: 'calc(-148px + 100vh)' }}>
                    <div className="mb-20 text-center source-header">
                        <h2 className="font-max font-size-24 mb-4 text-uppercase">Điều khoản sử dụng</h2>
                        <span className="text-subtitle text-uppercase">Điều khoản sử dụng</span>
                    </div>

                    <div className="font-size-15 thegioicode-tgc">
                        <em>
                            <b>
                                Các điều khoản sử dụng được Thegioicode thiết lập với mục đích nhằm đảm bảo giúp khách hàng cũng như
                                Thegioicode tránh được các trường hợp vi phạm pháp luật theo quy định hiện hành của nước Cộng hòa xã hội chủ
                                nghĩa Việt Nam đồng thời cũng giúp khách hàng bảo mật được thông tin cá nhân cùng toàn bộ dữ liệu của mình
                                trong quá trình sử dụng sản phẩm – dịch vụ của Thegioicode. Khi khách hàng tạo tài khoản và sử dụng sản phẩm
                                – dịch vụ của Thegioicode đồng nghĩa với việc khách hàng đã hoàn toàn đồng ý và chấp thuận với các điều
                                khoản sử dụng mà Thegioicode đã đưa ra.
                            </b>
                        </em>

                        <div className="mt-5">
                            <h2>1. Trách nhiệm của Thegioicode</h2>

                            <ul>
                                <li>
                                    Thegioicode đảm bảo cung cấp dịch vụ như đã cam kết trong{' '}
                                    <Link to={router.commit} target="_blank">
                                        “Cam kết chất lượng dịch vụ”
                                    </Link>
                                    , thực hiện đúng{' '}
                                    <Link to={router.privacy} target="_blank">
                                        “Chính sách bảo mật”
                                    </Link>{' '}
                                    như đã công bố trên các website chính thức của Thegioicode.
                                </li>
                                <li>
                                    Thegioicode không chịu trách nhiệm các trường hợp khách hàng vi phạm các hình thức sử dụng không được
                                    chấp nhận được quy định trong mục 3 trong điều khoản này.
                                </li>
                                <li>
                                    Thegioicode không có nghĩa vụ giám sát, kiểm soát hoạt động của người sử dụng và từ chối bất kỳ trách
                                    nhiệm nào trong việc người sử dụng lạm dụng hoặc dùng sai mục đích sử dụng hệ thống của Thegioicode.
                                </li>
                                <li>Thegioicode không hỗ trợ các thao tác quản trị nội dung website của khách hàng</li>
                                <li>
                                    Thegioicode đảm bảo tiếp nhận các yêu cầu hỗ trợ từ khách hàng thông qua:
                                    <ul>
                                        <li>
                                            <em>
                                                Hotline: <a href="tel:0706661234">070 666 1234</a>
                                            </em>
                                        </li>
                                        <li>
                                            <em>
                                                Telegram: <a href="https://t.me/thegioicode">@thegioicode</a>
                                            </em>
                                        </li>
                                        <li>
                                            <em>
                                                Email: <a href="mailto:support@thegioicode.com">support@thegioicode.com</a>
                                            </em>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <h2>2. Trách nhiệm của khách hàng</h2>
                            <ul>
                                <li>Tuyệt đối nghiêm chỉnh chấp hành Hiến pháp và Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam.</li>
                                <li>
                                    Khách hàng phải chịu hoàn toàn trách nhiệm nếu vi phạm các hình thức sử dụng không được chấp nhận trong
                                    mục 3 điều khoản này.
                                </li>
                                <li>
                                    Khách hàng phải cung cấp thông tin liên hệ đầy đủ và chính xác bao gồm: họ tên, địa chỉ, email, số điện
                                    thoại. Trong trường hợp cần thiết (theo quy định của pháp luật tùy theo loại dịch vụ) khách hàng phải
                                    cung cấp các giấy tờ có liên quan theo yêu cầu của Thegioicode (bản sao chứng minh thư nhân dân hoặc các
                                    văn bản giấy tờ khác). Trong trường hợp khách hàng chuyển giao / bổ sung quyền quản lý / quyền sở hữu
                                    tài khoản khách hàng / các gói sản phẩm – dịch vụ khách hàng đang sử dụng, khách hàng cần đảm bảo cập
                                    nhật thông tin liên hệ đầy đủ và chính xác trong hệ thống quản lý của Thegioicode.
                                </li>
                                <li>
                                    Khách hàng cần phải giữ an toàn các thông tin nhận biết, mật khẩu hoặc những thông tin mật khác liên
                                    quan đến tài khoản. Lập tức thông báo cho Thegioicode khi phát hiện các hình thức truy cập trái phép
                                    bằng tài khoản của khách hàng hoặc các sơ hở về bảo mật, bao gồm việc mất mát, đánh cắp hoặc để lộ các
                                    thông tin về mật khẩu và các thông tin bảo mật khác.
                                </li>
                                <li>
                                    Khách hàng phải chịu trách nhiệm đảm bảo an toàn cho thiết bị truy nhập dịch vụ của mình bao gồm cả việc
                                    sử dụng các phần mềm bảo mật cá nhân như phần mềm diệt virus, tường lửa.
                                </li>
                                <li>
                                    Khách hàng có trách nhiệm thực hiện việc duy trì và bảo quản dữ liệu trên server. Khách hàng sử dụng
                                    dịch vụ phải cam kết phản ánh trung thực về chất lượng sản phẩm – dịch vụ của Thegioicode trên mọi
                                    phương tiện truyền thông, website, diễn đàn… Đồng thời mọi phản ánh đều phải kèm theo bằng chứng xác
                                    thực. Thegioicode có quyền đơn phương chấm dứt hợp đồng nếu phát hiện nội dung phản ánh không xác thực
                                    và mang tính công kích, bôi nhọ làm ảnh hưởng tiêu cực đến uy tín của nhà cung cấp.
                                </li>
                            </ul>

                            <h2>3. Các hình thức sử dụng không được chấp nhận</h2>
                            <h3>3.1. Vi phạm liên quan đến máy chủ và mạng</h3>
                            <ul>
                                <li>
                                    Lưu trữ tài liệu, phát tán thông tin, sử dụng hoặc lưu trữ các chương trình gây hại như virus, worms,
                                    trojan trên hệ thống máy chủ của Thegioicode.
                                </li>
                                <li>
                                    Sử dụng dịch vụ do Thegioicode cung cấp để tấn công, truy cập trái phép, kiểm soát chặn dữ liệu các
                                    website hoặc máy chủ của người sử dụng nhà cung cấp khác.
                                </li>
                                <li>
                                    Can thiệp thay đổi hệ thống kiểm soát, theo dõi tài nguyên và các file log gây ảnh hưởng tới quy trình
                                    quản lý điều hành của Thegioicode.
                                </li>
                                <li>
                                    Sử dụng những mã nguồn gây quá tải hệ thống hoặc chiếm dụng quá mức tài nguyên theo quy định về giới hạn
                                    của gói dịch vụ hay scan, spam, VPN hack 4G công cộng, torrent...
                                </li>
                                <li>
                                    Gửi email dưới mọi hình thức mang mục đích phá hoại hay phát tán thư, bao gồm các chương trình gửi mail
                                    quá số lượng quy định (100mail/giờ).
                                </li>
                            </ul>

                            <h3>3.2. Vi phạm nội dung</h3>
                            <p>
                                Khách hàng không được lưu trữ, phát tán những thông tin, tài liệu vi phạm luật pháp nhà nước CHXHCN Việt Nam
                                và các quy định quốc tế được áp dụng tại Việt Nam bao gồm:
                            </p>
                            <ul>
                                <li>Tuyên truyền, đả kích mang tính phản động.</li>
                                <li>Hướng dẫn sử dụng các thiết bị quân sự.</li>
                                <li>Dùng ngôn ngữ thiếu văn hóa, vi phạm các chuẩn mực đạo đức, văn hóa truyền thống Việt Nam.</li>
                                <li>Mang tính chất khiêu dâm, tuyên truyền lối sống đồi trụy.</li>
                                <li>
                                    Vi phạm luật sáng chế, nhãn hiệu, quyền thiết kế, bản quyền hay bất kỳ quyền sở hữu trí tuệ hoặc các
                                    quyền hạn của bất kỳ cá nhân nào.
                                </li>
                                <li>Dữ liệu mang tính bất hợp pháp, đe dọa, lừa dối…. hay các hình thức bị ngăn cấm khác.</li>
                                <li>Dữ liệu cấu thành hoặc khuyến khích các hình thức phạm tội.</li>
                                <li>Tiết lộ bí mật thương mại, hoặc các thông tin cá nhân, bí mật, độc quyền của người khác.</li>
                            </ul>

                            <h3>3.3. Vi phạm về bảo mật</h3>
                            <p>Khách hàng không được phép thực hiện các hành vi trái pháp luật, lạm dụng, hoặc vô trách nhiệm bao gồm:</p>
                            <ul>
                                <li>
                                    Truy cập, sử dụng dữ liệu, hệ thống hoặc mạng lưới trái phép bao gồm mọi hành vi thăm dò, rà quét, kiểm
                                    tra các lỗ hổng hệ thống mạng, xâm phạm các biện pháp bảo mật và chứng thực mà không có sự đồng ý của
                                    chủ sở hữu hệ thống mạng (bao gồm khách hàng đang truy cập Web và các khách hàng đang sử dụng sản phẩm –
                                    dịch vụ tại Thegioicode).
                                </li>
                                <li>
                                    Giám sát dữ liệu hoặc lưu lượng truy cập trên bất kỳ mạng hoặc hệ thống mà không được phép của chủ sở
                                    hữu của hệ thống hoặc mạng.
                                </li>
                                <li>
                                    Sử dụng tài khoản Internet hoặc máy tính mà không có ủy quyền của chủ sở hữu như quét mật khẩu, lừa
                                    người khác để họ cung cấp mật khẩu, cướp mật khẩu, quét lỗ hổng bảo mật, cổng đăng nhập.
                                </li>
                                <li>Mọi hành vi giả mạo TCP-IP hoặc bất kỳ phần tiêu đề email nào trong một email.</li>
                            </ul>

                            <h2>4. Quản lý thông tin</h2>
                            <h3>4.1. Quản lý thông tin</h3>
                            <p>
                                Khách hàng có trách nhiệm thanh toán đầy đủ và đúng hạn các chi phí phát sinh khi sử dụng dịch vụ của
                                Thegioicode.Chúng tôi sẽ tiến hành liên hệ với khách hàng vào các thời điểm:
                            </p>
                            <ul>
                                <li>Khi hệ thống xuất hóa đơn (thông báo qua email).</li>
                                <li>
                                    Khi hóa đơn hết hạn thanh toán đồng thời ngừng cung cấp dịch vụ (3 ngày làm việc sau khi xuất hóa đơn)
                                    (thông báo qua điện thoại, email).
                                </li>
                            </ul>
                            <p>
                                Khi nhận được thông báo yêu cầu thanh toán chi phí sử dụng, khách hàng cần thanh toán đầy đủ chi phí phòng
                                trừ trường hợp dịch vụ của khách hàng có thể bị gián đoạn hoặc mất mát khi dịch vụ bị hết hạn.
                            </p>

                            <h3>4.2. Hoàn trả cước phí</h3>
                            <p>
                                Thegioicode sẽ hoàn trả chi phí trong trường hợp chúng tôi không tiếp tục cung cấp những dịch vụ mà khách
                                hàng đã thanh toán. Trong trường hợp lỗi không thuộc về Thegioicode, mọi cước phí sẽ không được hoàn trả.
                            </p>

                            <h2>5. Ngừng cung cấp dịch vụ và xóa vĩnh viễn dịch vụ</h2>
                            <h3>5.1. Ngừng cung cấp dịch vụ</h3>
                            <p>Thegioicode sẽ ngừng cung cấp dịch vụ trong các trường hợp sau:</p>
                            <ul>
                                <li>Quá 3 ngày làm việc kể từ ngày xuất hóa đơn mà khách hàng chưa thanh toán chi phí.</li>
                                <li>Khách hàng vi phạm các hình thức quy định ở mục 3 điều khoản này.</li>
                                <li>
                                    Khách hàng khai báo thông tin (tên, số điện thoại…) không đúng nhằm tìm cách gian lận sử dụng hoặc thanh
                                    toán.
                                </li>
                                <li>
                                    Các tài khoản có dấu hiệu bất thường như: một người sử dụng thử nhiều tài khoản, nhiều tài khoản xác
                                    thực cùng một số điện thoại, các tài khoản tương tự nhau.
                                </li>
                                <li>Các trường hợp phát sinh do Thegioicode quy định.</li>
                            </ul>

                            <h3>5.2. Xóa vĩnh viễn dịch vụ</h3>
                            <p>Thegioicode sẽ xóa vĩnh viễn dịch vụ trong các trường hợp sau:</p>
                            <ul>
                                <li>Sau 10 ngày làm việc kể từ ngày xuất hóa đơn mà khách hàng chưa thanh toán chi phí.</li>
                                <li>Khách hàng vi phạm các hình thức quy định ở mục 3 điều khoản này.</li>
                                <li>
                                    Khách hàng khai báo thông tin (tên, số điện thoại…) không đúng nhằm tìm cách gian lận sử dụng hoặc thanh
                                    toán.
                                </li>
                                <li>
                                    Các tài khoản có dấu hiệu bất thường như: một người sử dụng thử nhiều tài khoản, nhiều tài khoản xác
                                    thực cùng một số điện thoại, các tài khoản tương tự nhau với tần suất cao.
                                </li>
                                <li>Các trường hợp phát sinh do Thegioicode quy định.</li>
                            </ul>

                            <h2>6. Sao lưu và phục hồi dữ liệu</h2>
                            <ul>
                                <li>
                                    Các gói dịch vụ máy chủ ảo mặc định không kèm theo dịch vụ sao lưu dữ liệu, do đó khách hàng vui lòng
                                    liên hệ với nhóm hỗ trợ khách hàng của Thegioicode để được hướng dẫn thực hiện sao lưu dữ liệu trực tiếp
                                    trên server hoặc sử dụng thêm gói dịch vụ sao lưu dữ liệu nếu cần thiết.
                                </li>
                                <li>
                                    Thegioicode không chịu trách nhiệm về những sự cố xảy ra cho các bản sao lưu dữ liệu do các nguyên nhân
                                    khách quan như khủng bố, thiên tai, hỏa hoạn.v.v.
                                </li>
                                <li>
                                    Việc sao lưu sẽ không được cung cấp cho các tài khoản đã bị ngừng cung cấp hoặc xóa vĩnh viễn dịch vụ vì
                                    bất cứ lý do gì trừ trường hợp có thỏa thuận khác bằng văn bản của cả hai bên.
                                </li>
                                <li>
                                    Thegioicode chỉ có trách nhiệm phục hồi dữ liệu toàn phần (toàn bộ thư mục chứa mã nguồn, thư mục chứa
                                    email hoặc toàn bộ cơ sở dữ liệu) hoặc cung cấp bản sao lưu để khách hàng tự xử lý chứ không thực hiện
                                    việc phục hồi dữ liệu từng file riêng lẻ theo yêu cầu của khách hàng.
                                </li>
                            </ul>

                            <h2>7. Bồi thường</h2>
                            <p>
                                Trong trường hợp Thegioicode bị kiện bởi các hành vi của khách hàng, khách hàng phải trả tất cả các khoản
                                phí bao gồm phí tổn thất, phí tòa án.
                            </p>

                            <h2>8. Thay đổi điều khoản sử dụng</h2>
                            <p>
                                Thegioicode có thể thay đổi, sửa đổi, bổ sung hoặc thay thế nội dung điều khoản sử dụng bất cứ khi nào nhằm
                                phù hợp với quy định của pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam. Mọi thay đổi có hiệu lực kể từ
                                khi được công bố trên website <a href="mailto:noreply@thegioicode.com">noreply@thegioicode.com</a>
                            </p>
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

export default Terms;
