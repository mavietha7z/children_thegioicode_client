import { Button, Table } from 'antd';
import { Fragment, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

const columns = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: 'Mô-đun',
        dataIndex: 'modun',
        key: 'modun',
    },
    {
        title: 'Mô tả',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: 'Bao gồm',
        dataIndex: 'include',
        key: 'include',
        render: (include) => (
            <Fragment>{include ? <IconCheck size={18} className="text-success" /> : <IconX size={18} className="text-danger" />}</Fragment>
        ),
    },
    {
        title: 'Hành động',
        key: 'action',
        render: (data, record) => (
            <Button type="primary" onClick={() => record.onExpand(record)}>
                Xem chi tiết
            </Button>
        ),
    },
];

const TemplateModun = ({ details }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const onExpand = (record) => {
        const keys = expandedRowKeys.includes(record.key)
            ? expandedRowKeys.filter((k) => k !== record.key)
            : [...expandedRowKeys, record.key];
        setExpandedRowKeys(keys);
    };

    const defaultExpandable = {
        expandedRowRender: (record) => (
            <ul className="py-2 pl-4">
                {record.description.map((desc, index) => (
                    <li key={index} className="mb-2 text-subtitle">
                        {desc}
                    </li>
                ))}
            </ul>
        ),
        expandedRowKeys,
        onExpand: (_, record) => onExpand(record),
        expandIcon: () => null,
    };

    return (
        <Table
            className="source-detail"
            expandable={defaultExpandable}
            pagination={false}
            columns={columns}
            dataSource={details.map((detail) => ({ ...detail, onExpand }))}
        />
    );
};

export default TemplateModun;
