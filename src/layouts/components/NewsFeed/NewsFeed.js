import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card, Flex, Divider, notification, Tooltip, Badge } from 'antd';
import {
    IconX,
    IconHeart,
    IconShare3,
    IconHeartFilled,
    IconPinnedFilled,
    IconMessageCircle,
    IconCircleCheckFilled,
} from '@tabler/icons-react';

import './NewsFeed.css';
import router from '~/configs/routes';
import { shortNumberConversion } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserLikeNewsFeeds } from '~/services/app';
import imageAvatarDefault from '~/assets/image/avatar-default.png';

function NewsFeed({ onHide, data }) {
    const [newsFeeds, setNewsFeeds] = useState([]);
    const [isClosing, setIsClosing] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        setNewsFeeds(data);
    }, [data]);

    const handleHideNewFeed = () => {
        setIsClosing(true);

        setTimeout(() => {
            onHide(false);
            setIsClosing(false);

            document.body.classList.remove('open-new-feed');
        }, 300);
    };

    const handleLikeNewsFeed = async (id) => {
        if (!currentUser) {
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để yêu thích bài viết' });
        }

        const result = await requestUserLikeNewsFeeds({ id });

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const cloneNewsFeeds = [...newsFeeds];

            const indexNewsFeed = cloneNewsFeeds.findIndex((newsFeed) => newsFeed.id === id);
            if (indexNewsFeed === -1) return;

            cloneNewsFeeds[indexNewsFeed].is_like = result.data;
            if (result.data) {
                cloneNewsFeeds[indexNewsFeed].like_count += 1;
            } else {
                cloneNewsFeeds[indexNewsFeed].like_count -= 1;
            }
            setNewsFeeds(cloneNewsFeeds);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <div className={`news_feed ${isClosing ? 'closing' : ''}`}>
            <div className="news_feed-container">
                <div className="news_feed-header">
                    <h2 className="font-size-20">Tin tức</h2>
                    <button className="news_feed-close" onClick={handleHideNewFeed}>
                        <IconX size={24} />
                    </button>
                </div>

                <Divider className="m-0" />

                <div className="news_feed-body">
                    {newsFeeds.map((newsFeed) =>
                        newsFeed.pin_top ? (
                            <Badge.Ribbon
                                key={newsFeed.id}
                                style={{ padding: '0px 4px' }}
                                text={
                                    <div className="box-center p-1 cursor-pointer">
                                        <Tooltip title="Bài viết được ghim">
                                            <IconPinnedFilled size={20} style={{ transform: 'rotate(45deg)' }} />
                                        </Tooltip>
                                    </div>
                                }
                            >
                                <Card
                                    className="news_feed-body-item"
                                    styles={{ header: { padding: '12px 20px' }, body: { padding: 0 } }}
                                    title={
                                        <Flex align="center">
                                            <Avatar
                                                src={newsFeed.user.avatar_url || imageAvatarDefault}
                                                style={{ width: 48, height: 48, lineHeight: 48 }}
                                                alt={newsFeed.user.full_name}
                                            />
                                            <div className="ml-2">
                                                <div
                                                    className="font-size-17 font-bold d-flex align-items-center gap-1"
                                                    style={{ marginBottom: -6 }}
                                                >
                                                    <span>{newsFeed.user.full_name}</span>
                                                    <Tooltip title="Tài khoản đã xác minh">
                                                        <IconCircleCheckFilled className="text-primary" size={14} />
                                                    </Tooltip>
                                                </div>
                                                <span className="text-subtitle font-size-13">
                                                    {moment(newsFeed.created_at).format('DD/MM/YYYY HH:mm')}
                                                </span>
                                            </div>
                                        </Flex>
                                    }
                                >
                                    <div
                                        className="font-size-16"
                                        style={{ padding: '12px 20px' }}
                                        dangerouslySetInnerHTML={{ __html: newsFeed.content_html }}
                                    />
                                    <Divider className="m-0" />
                                    <Flex justify="space-between" className="news_feed-footer" style={{ padding: '12px 20px' }}>
                                        <div className="box-center" title="Yêu thích">
                                            {newsFeed.is_like ? (
                                                <IconHeartFilled
                                                    size={22}
                                                    className="cursor-pointer text-danger"
                                                    onClick={() => handleLikeNewsFeed(newsFeed.id)}
                                                />
                                            ) : (
                                                <IconHeart
                                                    size={22}
                                                    className="cursor-pointer"
                                                    onClick={() => handleLikeNewsFeed(newsFeed.id)}
                                                />
                                            )}
                                            <span className="ml-1">{shortNumberConversion(newsFeed.like_count)}</span>
                                        </div>
                                        <Flex align="center" gap={20}>
                                            <div className="box-center" title="Bình luận">
                                                <IconMessageCircle size={22} className="cursor-pointer" />
                                                <span className="ml-1">{shortNumberConversion(newsFeed.comment_count)}</span>
                                            </div>
                                            <div className="box-center" title="Chia sẻ">
                                                <IconShare3 size={22} className="cursor-pointer" />
                                                <span className="ml-1">{shortNumberConversion(newsFeed.share_count)}</span>
                                            </div>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Badge.Ribbon>
                        ) : (
                            <Card
                                key={newsFeed.id}
                                className="news_feed-body-item"
                                styles={{ header: { padding: '12px 20px' }, body: { padding: 0 } }}
                                title={
                                    <Flex align="center">
                                        <Avatar
                                            src={newsFeed.user.avatar_url || imageAvatarDefault}
                                            style={{ width: 48, height: 48, lineHeight: 48 }}
                                            alt={newsFeed.user.full_name}
                                        />
                                        <div className="ml-2">
                                            <div
                                                className="font-size-17 font-bold d-flex align-items-center gap-1"
                                                style={{ marginBottom: -6 }}
                                            >
                                                <span>{newsFeed.user.full_name}</span>
                                                <Tooltip title="Tài khoản đã xác minh">
                                                    <IconCircleCheckFilled className="text-primary" size={14} />
                                                </Tooltip>
                                            </div>
                                            <span className="text-subtitle font-size-13">
                                                {moment(newsFeed.created_at).format('DD/MM/YYYY HH:mm')}
                                            </span>
                                        </div>
                                    </Flex>
                                }
                            >
                                <div
                                    className="font-size-16"
                                    style={{ padding: '12px 20px' }}
                                    dangerouslySetInnerHTML={{ __html: newsFeed.content_html }}
                                />
                                <Divider className="m-0" />
                                <Flex justify="space-between" className="news_feed-footer" style={{ padding: '12px 20px' }}>
                                    <div className="box-center" title="Yêu thích">
                                        {newsFeed.is_like ? (
                                            <IconHeartFilled
                                                size={22}
                                                className="cursor-pointer text-danger"
                                                onClick={() => handleLikeNewsFeed(newsFeed.id)}
                                            />
                                        ) : (
                                            <IconHeart
                                                size={22}
                                                className="cursor-pointer"
                                                onClick={() => handleLikeNewsFeed(newsFeed.id)}
                                            />
                                        )}
                                        <span className="ml-1">{shortNumberConversion(newsFeed.like_count)}</span>
                                    </div>
                                    <Flex align="center" gap={20}>
                                        <div className="box-center" title="Bình luận">
                                            <IconMessageCircle size={22} className="cursor-pointer" />
                                            <span className="ml-1">{shortNumberConversion(newsFeed.comment_count)}</span>
                                        </div>
                                        <div className="box-center" title="Chia sẻ">
                                            <IconShare3 size={22} className="cursor-pointer" />
                                            <span className="ml-1">{shortNumberConversion(newsFeed.share_count)}</span>
                                        </div>
                                    </Flex>
                                </Flex>
                            </Card>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewsFeed;
