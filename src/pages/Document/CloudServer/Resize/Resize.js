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
        title: 'JSON',
        parameter: 'order_id',
        type: 'Number | String',
        description: 'ID đơn máy chủ muốn nâng cấp',
    },
    {
        title: 'JSON',
        parameter: 'product_id',
        type: 'Number | String',
        description: 'ID gói dịch vụ mới muốn nâng cấp',
    },
];

const example = {
    order_id: 73665972,
    product_id: 65550677,
};

const responseSuccess = {
    data: {
        id: 73665972,
        plan: {
            _id: '67827e4ee60742929be44f56',
            title: 'Premium',
            image_url: 'https://thegioicode.com/images/TrchbOWyGD.png',
            description:
                'Ứng dụng đòi hỏi hiệu năng cao - Trang bị CPU Intel Xeon Gold/Platinum Gen 2 cùng với ổ cứng Enterprise NVMe siêu siêu nhanh',
            id: 28836824,
        },
        status: 'resizing',
        method: 'api',
        image: {
            title: 'Ubuntu-24.04_64bit',
            group: 'Ubuntu',
            image_url: 'https://thegioicode.com/images/WgRKOOXGtM.png',
            description: '',
            id: 74733771,
        },
        region: {
            title: 'Việt Nam',
            image_url: 'https://thegioicode.com/images/SOAsaJEpxu.png',
            description: '',
            id: 82206976,
        },
        product: {
            id: 65550677,
            core: 1,
            disk: 20,
            title: 'Premium #2',
            memory: 2048,
            bandwidth: 1000,
            customize: false,
            network_speed: 100,
        },
        slug_url: 'ce04f497-2a5e-4d52-955b-6a84cd4bd6a3',
        cpu_usage: 0.1,
        auto_renew: false,
        disk_usage: 1.865234375,
        description: '',
        memory_usage: 0,
        display_name: 'ubuntu2004',
        backup_server: false,
        override_price: 111071.5,
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
    status: 200,
    message: 'Nâng cấp cấu hình máy chủ thành công',
};

function Resize() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Thay đổi cấu hình</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-warning font-bold">POST</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/resize
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

export default Resize;
