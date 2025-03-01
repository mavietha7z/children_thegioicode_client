const user = '/user';
const proxy = '/proxy';
const cloud = '/cloud';
const billing = '/billing';
const sources = '/ma-nguon';
const security = '/security';
const document = '/document';

const router = {
    user,
    proxy,
    cloud,
    billing,
    sources,
    document,
    home: '/',
    cart: '/cart',
    terms: '/terms',
    commit: '/commit',
    privacy: '/privacy',
    affiliate: '/affiliate',
    resources: '/tai-khoan',
    apikey: user + '/apikey',
    security: user + security,
    templates: '/tao-website',
    profile: user + '/profile',
    general: user + '/general',
    public_apis: '/public-apis',
    cloud_server: cloud + '-server',
    proxy_server: proxy + '-server',
    notifications: '/notifications',
    sources_fees: sources + '/tra-phi',
    bonus_point: user + '/bonus-point',
    billing_orders: billing + '/orders',
    sources_free: sources + '/mien-phi',
    notification: user + '/notification',
    billing_balance: billing + '/balance',
    history_login: user + '/history-login',
    billing_invoices: billing + '/invoices',
    billing_templates: billing + '/templates',
    billing_instances: billing + '/instances',
    document_cloud_server: document + '/cloud-server',
    changePassword: user + security + '/change-password',
    twoFactor: user + security + '/two-factor-authentication',
};

export default router;
