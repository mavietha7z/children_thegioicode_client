import router from '~/configs/routes';

import Cart from '~/pages/Cart';

import Home from '~/layouts/Home/Home';

import NotFound from '~/layouts/NotFound';

import Notification from '~/pages/Notification';

import PublicAPI from '~/pages/PublicAPI';
import PublicAPIDetail from '~/pages/PublicAPI/PublicAPIDetail';

import ApiKey from '~/pages/account/ApiKey';
import Profile from '~/pages/account/Profile';
import Security from '~/pages/account/Security';
import BonusPoint from '~/pages/account/BonusPoint';
import HistoryLogin from '~/pages/account/HistoryLogin';
import TwoFactor from '~/pages/account/Security/TwoFactor';
import ChangePassword from '~/pages/account/Security/ChangePassword';

import Source from '~/pages/Source';
import SourcesDetail from '~/pages/Source/SourceDetail';
import SourceCategory from '~/pages/Source/SourceCategory';

import Orders from '~/pages/Billing/Orders';
import Balance from '~/pages/Billing/Balance';
import Recharge from '~/pages/Billing/Recharge';
import Invoices from '~/pages/Billing/Invoices';
import Instances from '~/pages/Billing/Instances';
import BillingTemplate from '~/pages/Billing/Template';
import OrderDetail from '~/pages/Billing/Orders/OrderDetail';
import InvoiceDetail from '~/pages/Billing/Invoices/InvoiceDetail';
import InstanceDetail from '~/pages/Billing/Instances/InstanceDetail';
import ResizeInstance from '~/pages/Billing/Instances/ResizeInstance';
import RebuildInstance from '~/pages/Billing/Instances/RebuildInstance';
import TemplateBillingDetail from '~/pages/Billing/Template/TemplateDetail';

import Template from '~/pages/Template';
import TemplateDetail from '~/pages/Template/TemplateDetail';

import RefProfile from '~/components/RefProfile';

import CloudServer from '~/pages/CloudServer';

import Terms from '~/layouts/components/Terms';
import Commit from '~/layouts/components/Commit';
import Privacy from '~/layouts/components/Privacy';

export const privateRoutes = [
    { path: '*', component: NotFound },
    { path: router.home, component: Home },
    { path: router.cart, component: Cart },
    { path: router.terms, component: Terms },
    { path: router.commit, component: Commit },
    { path: router.apikey, component: ApiKey },
    { path: router.sources, component: Source },
    { path: router.privacy, component: Privacy },
    { path: router.profile, component: Profile },
    { path: router.user, component: RefProfile },
    { path: router.billing, component: Recharge },
    { path: router.security, component: Security },
    { path: router.templates, component: Template },
    { path: router.twoFactor, component: TwoFactor },
    { path: router.public_apis, component: PublicAPI },
    { path: router.billing_orders, component: Orders },
    { path: router.bonus_point, component: BonusPoint },
    { path: router.billing_balance, component: Balance },
    { path: router.cloud_server, component: CloudServer },
    { path: router.billing_invoices, component: Invoices },
    { path: router.notifications, component: Notification },
    { path: router.history_login, component: HistoryLogin },
    { path: router.billing_instances, component: Instances },
    { path: router.changePassword, component: ChangePassword },
    { path: router.billing_templates, component: BillingTemplate },
    { path: router.sources + '/:category', component: SourceCategory },
    { path: router.public_apis + '/:slug', component: PublicAPIDetail },
    { path: router.sources + '/detail/:slug', component: SourcesDetail },
    { path: router.billing_orders + '/:order_id', component: OrderDetail },
    { path: router.templates + '/detail/:slug', component: TemplateDetail },
    { path: router.billing_invoices + '/:invoice_id', component: InvoiceDetail },
    { path: router.billing_instances + '/:instance_id', component: InstanceDetail },
    { path: router.billing_templates + '/:template_id', component: TemplateBillingDetail },
    { path: router.billing_instances + '/:instance_id/resize', component: ResizeInstance },
    { path: router.billing_instances + '/:instance_id/rebuild', component: RebuildInstance },
];
