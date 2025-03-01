import { Card } from 'antd';

const data = [
    {
        id: 2,
        title: 'Liên hệ qua Zalo',
        description: 'Liên hệ qua Zalo để được tư vấn',
        link: 'https://zalo.me/0987654321',
    },
    {
        id: 1,
        title: 'Liên hệ qua Hotline',
        description: 'Liên hệ qua Hotline để được tư vấn',
        link: 'tel:0987654321',
    },
    {
        id: 3,
        title: 'Liên hệ qua Telegram',
        description: 'Liên hệ qua Telegram để được tư vấn',
        link: 'https://t.me/netcode',
    },
];

function Support() {
    return (
        <Card
            className="rounded-15 mb-4"
            title={
                <h2 className="font-semibold mb-0 white-space-break">
                    <span className="font-size-18 font-semibold">Hỗ trợ</span>
                </h2>
            }
        >
            {data.map((item) => (
                <div className="link-color" key={item.id}>
                    <a href={item.link} className="text-primary font-bold font-size-15" target="_blank" rel="noreferrer">
                        {item.title}
                    </a>
                    <p className="text-subtitle line-height-17 mt-2px mb-4">{item.description}</p>
                </div>
            ))}
        </Card>
    );
}

export default Support;
