import { Collapse, Flex, Table } from 'antd';

const columns = [
    {
        title: 'Loại',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Tham số',
        dataIndex: 'parameter',
        key: 'parameter',
    },
    {
        title: 'Kiểu dữ liệu',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
];

const dataSource = [
    {
        title: 'Body JSON',
        parameter: 'order_id',
        type: 'Number | String',
        description: 'ID đơn hàng máy chủ muốn thao tác',
    },
    {
        title: 'Body JSON',
        parameter: 'action',
        type: 'String',
        description: 'Thao tác muốn thực hiện "auto-renew", "stop", "start", "restart"',
    },
];

const example = {
    order_id: 73665972,
    action: 'stop',
};

const responseSuccess = {
    data: {
        id: 73665972,
        plan: {
            title: 'Premium',
            image_url: 'https://thegioicode.com/images/TrchbOWyGD.png',
            description:
                'Ứng dụng đòi hỏi hiệu năng cao - Trang bị CPU Intel Xeon Gold/Platinum Gen 2 cùng với ổ cứng Enterprise NVMe siêu siêu nhanh',
            id: 28836824,
        },
        status: 'stopping',
        method: 'api',
        image: {
            title: 'Ubuntu-20.04_64bit',
            group: 'Ubuntu',
            image_url: 'https://thegioicode.com/images/eTgIWUuUgV.png',
            description: '',
            id: 21859853,
        },
        region: {
            title: 'Việt Nam',
            image_url: 'https://thegioicode.com/images/SOAsaJEpxu.png',
            description: '',
            id: 82206976,
        },
        slug_url: 'ce04f497-2a5e-4d52-955b-6a84cd4bd6a3',
        product: {
            title: 'Premium #1',
            core: 1,
            memory: 1024,
            disk: 20,
            bandwidth: 1000,
            network_speed: 100,
            customize: false,
            id: 91900449,
        },
        cpu_usage: 0.1,
        auto_renew: false,
        disk_usage: 1.865234375,
        description: '',
        memory_usage: 0,
        display_name: 'ubuntu2004',
        backup_server: false,
        override_price: 80000,
        bandwidth_usage: 0.03,
        order_info: {
            port: 22,
            hostname: 'ubuntu2004',
            username: 'root',
            password: 'FmQ0#tJ#6zaD',
            access_ipv4: '161.248.4.17',
            access_ipv6: '',
        },
        created_at: '2025-02-25 23:52:49',
        expired_at: '2025-04-25 23:59:59',
    },
    message: 'Thực hiện thao tác stop máy chủ thành công',
    status: 200,
};

function Action() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Các thao tác với máy chủ</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-warning font-bold">POST</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/action
                                </span>
                            </Flex>

                            <Table className="mt-4" bordered columns={columns} dataSource={dataSource} pagination={false} />

                            <div className="mt-3 mb-1">Body:</div>
                            <div>
                                <div className="copy">
                                    <pre>
                                        <code className="text-copy warning">{JSON.stringify(example, null, 2)}</code>
                                    </pre>
                                </div>
                            </div>

                            <div className="mt-3 mb-1">Thành công:</div>
                            <div>
                                <div className="copy">
                                    <pre>
                                        <code className="text-copy success">{JSON.stringify(responseSuccess, null, 2)}</code>
                                    </pre>
                                </div>
                            </div>

                            <div className="mt-3 mb-1">Thất bại:</div>
                            <div>
                                <div className="copy">
                                    <pre>
                                        <code className="text-copy">
                                            {JSON.stringify({ status: 'Mã code lỗi', error: 'Thông tin lỗi trả về' }, null, 4)}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}

export default Action;
