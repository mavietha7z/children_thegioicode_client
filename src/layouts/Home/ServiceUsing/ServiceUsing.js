import moment from 'moment';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { Avatar, Col, Empty, notification, Row, Table, Tabs, Tooltip } from 'antd';
import { IconArrowNarrowRight, IconServer2, IconWorldWww } from '@tabler/icons-react';

import router from '~/configs/routes';
import { calculateDaysLeft } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetServiceUsingOrderTemplates, requestUserGetServiceUsingOrderInstances } from '~/services/using';

const columns = [
    {
        title: 'Tên',
        key: 'title',
        render: (data) => {
            let routerService = '';
            if (data.service === 'templates') {
                routerService = router.billing_templates;
            }
            if (data.service === 'instances') {
                routerService = router.billing_instances;
            }

            return (
                <Link className="text-current hover-blue font-bold" to={`${routerService}/${data.id}`}>
                    {data.title.charAt(0).toUpperCase() + data.title.slice(1)}
                </Link>
            );
        },
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            let className = '';
            let style = {};

            if (status === 'activated') {
                className = 'label-light-success font-weight-bold';
                style = { backgroundColor: '#4caf501a', color: '#4caf50', border: '1px solid #4caf501a' };
            }
            if (status === 'pending' || status === 'wait_confirm' || status === 'starting') {
                className = 'label-light-warning font-weight-bold';
                style = { backgroundColor: '#ff98001a', color: '#ff9800', border: '1px solid #ff98001a' };
            }
            if (status === 'stopped' || status === 'inactivated' || status === 'expired' || status === 'blocked' || status === 'deleted') {
                className = 'label-light-danger font-weight-bold';
                style = { backgroundColor: '#f443361a', color: '#f44336', border: '1px solid #f443361a' };
            }

            return (
                <div className={className} style={style}>
                    {status.toUpperCase()}
                </div>
            );
        },
    },
    {
        title: 'Thời gian',
        key: 'date',
        render: (date) => (
            <Fragment>
                <Tooltip title="Ngày đăng ký">
                    <span>{moment(date.created_at).format('DD/MM/YYYY HH:mm')}</span>
                </Tooltip>
                <br />
                <Tooltip title="Ngày hết hạn">
                    <span>{moment(date.expired_at).format('DD/MM/YYYY HH:mm')}</span>
                </Tooltip>
                <br />(
                <b className={moment(date.expired_at).diff(new Date(), 'days') < 8 ? 'text-danger' : ''}>
                    {calculateDaysLeft(date.expired_at)}
                </b>
                )
            </Fragment>
        ),
    },
];

function ServiceUsing() {
    const [orderTemplates, setOrderTemplates] = useState([]);
    const [orderCloudServers, setCloudServers] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const handleResult = (result, successCallback) => {
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
            } else if (result.status === 200) {
                successCallback(result.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };

        const fetch = async () => {
            try {
                const [resultTemplate, resultInstance] = await Promise.all([
                    requestUserGetServiceUsingOrderTemplates(),
                    requestUserGetServiceUsingOrderInstances(),
                ]);

                handleResult(resultTemplate, setOrderTemplates);
                handleResult(resultInstance, setCloudServers);
            } catch (error) {
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };

        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = [];
    if (orderTemplates.length > 0) {
        items.push({
            label: (
                <span className="box-align-center gap-2">
                    <Avatar
                        style={{ width: 20, height: 20, lineHeight: 20, fontSize: 18, background: '#096eff', padding: 1 }}
                        icon={<IconWorldWww />}
                    />
                    Tạo Website ({orderTemplates.length})
                </span>
            ),
            key: '1',
            children: (
                <Fragment>
                    <Table
                        columns={columns}
                        dataSource={orderTemplates.map((template) => ({ key: template.id, ...template }))}
                        pagination={false}
                    />

                    <div className="p-2 d-flex">
                        <Link className="hover-underline box-center hover-blue font-size-15" to={router.billing_templates}>
                            <span className="mr-1">Xem thêm</span>
                            <IconArrowNarrowRight width={20} height={20} />
                        </Link>
                    </div>
                </Fragment>
            ),
        });
    }
    if (orderCloudServers.length > 0) {
        items.push({
            label: (
                <span className="box-align-center gap-2">
                    <Avatar
                        style={{ width: 20, height: 20, lineHeight: 20, fontSize: 18, background: '#096eff', padding: 1 }}
                        icon={<IconServer2 />}
                    />
                    Cloud Server ({orderCloudServers.length})
                </span>
            ),
            key: '2',
            children: (
                <Fragment>
                    <Table
                        columns={columns}
                        dataSource={orderCloudServers.map((cloud) => ({ key: cloud.id, ...cloud }))}
                        pagination={false}
                    />

                    <div className="p-2 d-flex">
                        <Link className="hover-underline box-center hover-blue font-size-15" to={router.billing_instances}>
                            <span className="mr-1">Xem thêm</span>
                            <IconArrowNarrowRight width={20} height={20} />
                        </Link>
                    </div>
                </Fragment>
            ),
        });
    }

    return (
        <div className="mb-8">
            <h2 className="font-semibold font-size-20 mb-4">Các dịch vụ đang sử dụng</h2>

            {items.length > 0 ? (
                <Tabs type="card" items={items} className="home_tabs" />
            ) : (
                <Row align="middle" justify="center">
                    <Col>
                        <Empty
                            description={
                                <p className="mb-5 mt-5 w-max-600 text-subtitle font-size-15">
                                    <span className="font-size-15 mb-6 text-center">
                                        Bạn chưa khởi tạo dịch vụ nào, hãy <b>“Khởi tạo ngay”</b> các dịch vụ để bắt đầu trải nghiệm dịch vụ
                                        của chúng tôi.
                                    </span>
                                </p>
                            }
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default ServiceUsing;
