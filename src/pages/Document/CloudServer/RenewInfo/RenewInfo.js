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
        title: 'Params',
        parameter: 'order_id',
        type: 'Number | String',
        description: 'ID đơn máy chủ muốn gia hạn',
    },
];

const responseSuccess = {
    data: [
        {
            id: 74188112,
            cycle: '1 Tháng',
            price: 40000,
        },
        {
            id: 53709618,
            cycle: '3 Tháng',
            price: 114000,
        },
        {
            id: 32291119,
            cycle: '6 Tháng',
            price: 216000,
        },
        {
            id: 30032628,
            cycle: '12 Tháng',
            price: 408000,
        },
    ],
    status: 200,
    message: 'Lấy thông tin gia hạn máy chủ thành công',
};

function RenewInfo() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Lấy thông tin gia hạn</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-success font-bold">GET</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/renew/:order_id
                                </span>
                            </Flex>

                            <Table className="mt-4" bordered columns={columns} dataSource={dataSource} pagination={false} />

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

export default RenewInfo;
