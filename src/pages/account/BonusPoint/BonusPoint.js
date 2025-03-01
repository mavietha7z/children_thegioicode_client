import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconCancel, IconCheck } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Card, Col, Flex, Modal, notification, Pagination, Row, Segmented, Spin, Table, Tabs, InputNumber } from 'antd';

import './BonusPoint.css';
import Account from '../Account';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import imagePoint from '~/assets/image/point.png';
import IconBalance from '~/assets/icon/IconBalance';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserExchangeBonusPoint, requestUserGetBonusPoints } from '~/services/account';

function BonusPoint() {
    const [loading, setLoading] = useState(false);
    const [bonusPoints, setBonusPoints] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [segmentValue, setSegmentValue] = useState('Đổi toàn bộ điểm');

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Thegioicode.com - Điểm thưởng dịch vụ';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetBonusPoints('all', page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (result?.status === 200) {
                setPages(result.pages);
                setBonusPoints(result.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleOnChangeTabs = async (e) => {
        let result;
        if (e === '1') {
            result = await requestUserGetBonusPoints('all', 1);
        }
        if (e === '2') {
            result = await requestUserGetBonusPoints('income', 1);
        }
        if (e === '3') {
            result = await requestUserGetBonusPoints('exchange', 1);
        }

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setBonusPoints(result.data);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleExchangeBonusPoints = async (value) => {
        const { bonus_point } = value;

        if (currentUser?.wallet.bonus_point === 0) {
            return notification.error({
                message: 'Thông báo',
                description: 'Ví của bạn đã hết điểm thưởng',
            });
        }
        if (bonus_point && bonus_point > currentUser?.wallet.bonus_point) {
            return notification.error({
                message: 'Thông báo',
                description: 'Số điểm thưởng cần đổi không đủ',
            });
        }
        if (bonus_point && bonus_point < 100) {
            return notification.error({
                message: 'Thông báo',
                description: 'Số điểm cần đổi tối thiểu 100 điểm',
            });
        }
        let data = {
            type: 'all',
            bonus_point: currentUser?.wallet.bonus_point,
        };

        if (bonus_point) {
            data.type = 'point';
            data.bonus_point = bonus_point;
        }

        const result = await requestUserExchangeBonusPoint(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setPages(result.pages);
            setModalVisible(false);
            setSegmentValue('Đổi toàn bộ điểm');
            form.setFieldValue('bonus_point', 0);

            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const columns = [
        {
            title: 'Nội dung',
            key: 'description',
            render: (data) => {
                if (data.bonus_type === 'income') {
                    return (
                        <span>
                            Được cộng {convertCurrency(data.bonus_point).slice(0, -1)} điểm
                            {data.reason && (
                                <Fragment>
                                    , từ hóa đơn{' '}
                                    <Link to={`${router.billing_invoices}/${data.reason.invoice_id}`}>#{data.reason.invoice_id}</Link>
                                </Fragment>
                            )}
                        </span>
                    );
                }
                if (data.bonus_type === 'exchange') {
                    return <span>Đổi {convertCurrency(data.bonus_point).slice(0, -1)} điểm thành tiền khuyến mãi</span>;
                }
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => moment(created_at).format('DD/MM/YYYY HH:mm:ss'),
        },
        {
            title: 'Điểm',
            key: 'bonus_point',
            render: (data) => (
                <div className="d-flex align-items-center gap-1">
                    <span className={data.bonus_point > 0 ? 'text-success' : 'text-danger'}>
                        {data.bonus_point > 0 && '+'}
                        {convertCurrency(data.bonus_point).slice(0, -1)}
                    </span>

                    <img src={imagePoint} alt="Point" style={{ width: 12, height: 12 }} />
                </div>
            ),
        },
    ];

    const items = [
        {
            label: 'Tất cả',
            key: '1',
            children: (
                <Fragment>
                    <Table
                        columns={columns}
                        dataSource={bonusPoints.map((point, index) => ({ key: index, ...point }))}
                        pagination={false}
                    />

                    {Number(pages) > 1 && (
                        <Flex justify="end" style={{ margin: '20px 0 10px 0' }}>
                            <Pagination
                                current={page || 1}
                                pageSize={20}
                                total={Number(pages) * 20}
                                onChange={(page) => {
                                    setPage(page);
                                    setSearchParams({ page });
                                }}
                            />
                        </Flex>
                    )}
                </Fragment>
            ),
        },
        {
            label: 'Đã nhận',
            key: '2',
            children: (
                <Fragment>
                    <Table
                        columns={columns}
                        dataSource={bonusPoints.map((point, index) => ({ key: index, ...point }))}
                        pagination={false}
                    />

                    {Number(pages) > 1 && (
                        <Flex justify="end" style={{ margin: '20px 0 10px 0' }}>
                            <Pagination
                                current={page || 1}
                                pageSize={20}
                                total={Number(pages) * 20}
                                onChange={(page) => {
                                    setPage(page);
                                    setSearchParams({ page });
                                }}
                            />
                        </Flex>
                    )}
                </Fragment>
            ),
        },
        {
            label: 'Đã dùng',
            key: '3',
            children: (
                <Fragment>
                    <Table
                        columns={columns}
                        dataSource={bonusPoints.map((point, index) => ({ key: index, ...point }))}
                        pagination={false}
                    />

                    {Number(pages) > 1 && (
                        <Flex justify="end" style={{ margin: '20px 0 10px 0' }}>
                            <Pagination
                                current={page || 1}
                                pageSize={20}
                                total={Number(pages) * 20}
                                onChange={(page) => {
                                    setPage(page);
                                    setSearchParams({ page });
                                }}
                            />
                        </Flex>
                    )}
                </Fragment>
            ),
        },
    ];

    return (
        <Account>
            <div className="w-full">
                {loading ? (
                    <Flex align="center" justify="center" style={{ minHeight: '40vh' }}>
                        <Spin />
                    </Flex>
                ) : (
                    <Fragment>
                        <Card styles={{ body: { padding: 18 } }}>
                            <div className="bonus-point_wrap">
                                <div className="bonus-point_body">
                                    <div className="w-full">
                                        <div className="bonus-point_card">
                                            <div className="bonus-point_card-body">
                                                <div className="d-flex flex-column align-items-center">
                                                    <h3 className="text-center font-size-16 text-subtitle mb-4">Hạng thành viên</h3>
                                                    <div
                                                        className="box-membership-name px-3 py-2 font-size-20 line-height-20"
                                                        style={{ background: '#096eff', color: '#fff' }}
                                                    >
                                                        {currentUser?.membership.current.name}
                                                    </div>
                                                    <div className="mt-2 text-center">
                                                        Còn{' '}
                                                        <b>
                                                            {convertCurrency(
                                                                currentUser?.membership.next_membership.achieve_point -
                                                                    currentUser?.wallet.total_bonus_point,
                                                            ).slice(0, -1)}
                                                        </b>{' '}
                                                        điểm để đạt thành viên{' '}
                                                        <b>{currentUser?.membership.next_membership.name.toUpperCase()}</b>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bonus-point_divider" />

                                    <div className="w-full">
                                        <div className="bonus-point_card">
                                            <div className="bonus-point_card-body">
                                                <div className="d-flex flex-column align-items-center">
                                                    <h3 className="text-center font-size-16 text-subtitle mb-4">Điểm hiện tại</h3>
                                                    <div className="label-light-info px-3 py-2 font-size-18 line-height-18 rounded-full  w-full word-break-all  text-center max-w-content">
                                                        {convertCurrency(currentUser?.wallet.bonus_point).slice(0, -1)}
                                                    </div>
                                                    {currentUser?.wallet.bonus_point_expiry && (
                                                        <div className="mt-2 text-center">
                                                            Hết hạn sau{' '}
                                                            <b>{moment(currentUser?.wallet.bonus_point_expiry).diff(moment(), 'days')}</b>{' '}
                                                            ngày
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bonus-point_divider" />

                                    <div className="w-full">
                                        <div className="bonus-point_card">
                                            <div className="bonus-point_card-body">
                                                <div className="d-flex flex-column align-items-center">
                                                    <h3 className="text-center font-size-16 text-subtitle mb-4">Tổng điểm</h3>
                                                    <div className="label-light-success px-3 py-2 font-size-20 line-height-20 rounded-full w-full word-break-all text-center max-w-content">
                                                        {convertCurrency(currentUser?.wallet.total_bonus_point).slice(0, -1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            styles={{ body: { padding: 0 } }}
                            className="mt-6"
                            title={
                                <div className="w-full d-flex align-items-center justify-content-between flex-wrap col-gap-1 row-gap-2 bonus-point_title">
                                    <div className="font-size-17 line-height-20 white-space-break">Lịch sử tích điểm và sử dụng điểm</div>

                                    <Button
                                        icon={<IconBalance width={14} height={14} />}
                                        className="box-center"
                                        onClick={() => setModalVisible(true)}
                                    >
                                        Đổi điểm
                                    </Button>
                                </div>
                            }
                        >
                            <Tabs items={items} className="bonus-point_tabs" onChange={handleOnChangeTabs} />
                        </Card>

                        {modalVisible && (
                            <Modal
                                centered
                                closable={false}
                                maskClosable={false}
                                open={modalVisible}
                                onCancel={() => setModalVisible(false)}
                                width={450}
                                title="Đổi điểm thành tiền"
                                footer={null}
                            >
                                <div className="mb-2 text-subtitle">
                                    Quý khách có thể chọn đổi toàn bộ điểm hoặc nhập số điểm muốn đổi để thực hiện chuyển đổi thành tiền
                                    khuyến mãi.
                                </div>
                                <div className="mb-5 text-subtitle">
                                    Điểm hiện tại: <b>{convertCurrency(currentUser?.wallet.bonus_point).slice(0, -1)}</b>
                                </div>
                                <Segmented
                                    className="mb-4"
                                    block
                                    options={['Đổi toàn bộ điểm', 'Nhập điểm']}
                                    value={segmentValue}
                                    onChange={(value) => {
                                        setSegmentValue(value);
                                    }}
                                />

                                <Form layout="vertical" form={form} onFinish={handleExchangeBonusPoints}>
                                    {segmentValue === 'Nhập điểm' && (
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="bonus_point"
                                                    rules={[
                                                        {
                                                            validator: (_, value) => {
                                                                if (!value) {
                                                                    return Promise.reject('Số điểm nhập vào phải là số');
                                                                }
                                                                if (value <= 0) {
                                                                    return Promise.reject('Số điểm nhập vào phải lớn hơn 0');
                                                                }

                                                                return Promise.resolve();
                                                            },
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber size="large" placeholder="Điểm" className="w-full" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )}

                                    <div className="d-flex justify-content-end gap-2 flex-grow-1">
                                        <Button
                                            icon={<IconCancel size={17} />}
                                            className="min-height-35 box-center"
                                            onClick={() => setModalVisible(false)}
                                        >
                                            Huỷ
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<IconCheck size={17} />}
                                            className="min-height-35 box-center min-width-120 flex-1"
                                            htmlType="submit"
                                        >
                                            Xác nhận
                                        </Button>
                                    </div>
                                </Form>
                            </Modal>
                        )}
                    </Fragment>
                )}
            </div>
        </Account>
    );
}

export default BonusPoint;
