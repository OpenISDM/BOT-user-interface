import MainContainer from '../components/container/MainContainer';
import SystemSetting from '../components/container/menuContainer/SystemSetting';
import ObjectManagementContainer from '../components/container/menuContainer/ObjectManagementContainer';
import UserContainer from '../components/container/menuContainer/UserContainer';
import About from '../components/container/About';
import TraceContainer from '../components/container/menuContainer/TraceContainer';

const routes = [
    {
        path: '/',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/systemSetting',
        component: SystemSetting,
        exact: true,
    },
    {
        path: '/page/objectManagement',
        component: ObjectManagementContainer,
        exact: true,
    },
    {
        path: '/page/userSetting',
        component: UserContainer,
        exact: true,
    },
    {
        path: '/page/about',
        component: About,
        exact: true,
    },
    {
        path: '/page/trace',
        component: TraceContainer,
        exact: true,
    },
];

export default routes;