const user = '/user';
const cloud = '/cloud';
const billing = '/billing';
const sources = '/ma-nguon';
const security = '/security';

const router = {
    user,
    cloud,
    billing,
    sources,
    home: '/',
    cart: '/cart',
    terms: '/terms',
    commit: '/commit',
    privacy: '/privacy',
    apikey: user + '/apikey',
    security: user + security,
    templates: '/tao-website',
    profile: user + '/profile',
    public_apis: '/public-apis',
    cloud_server: cloud + '-server',
    notifications: '/notifications',
    sources_fees: sources + '/tra-phi',
    bonus_point: user + '/bonus-point',
    billing_orders: billing + '/orders',
    sources_free: sources + '/mien-phi',
    billing_balance: billing + '/balance',
    billing_sources: billing + '/sources',
    history_login: user + '/history-login',
    billing_invoices: billing + '/invoices',
    billing_templates: billing + '/templates',
    billing_instances: billing + '/instances',
    changePassword: user + security + '/change-password',
    twoFactor: user + security + '/two-factor-authentication',
};

export default router;
