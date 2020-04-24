import MainContainer from "../components/container/MainContainer";
import SystemSetting from "../components/container/menuContainer/SystemSetting";
import ObjectManagementContainer from "../components/container/menuContainer/ObjectManagementContainer";
import UserContainer from "../components/container/menuContainer/UserContainer"
import BigScreenContainer from "../components/container/bigScreen/BigScreenContainer"
import About from "../components/container/About"
import TrackingHistoryContainer from "../components/container/menuContainer/TrackingHistoryContainer"
import MonitorSettingContainer from "../components/container/menuContainer/MonitorSettingContainer"
import ReportContainer from "../components/container/menuContainer/ReportContainer"
import TraceContainer from "../components/container/TraceContainer";
import PDF from '../components/presentational/PDF'

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
        component: PDF,
        exact: true,
    },
    {
        path: '/page/trace',
        component: TraceContainer,
        exact: true,
    },
];

export default routes;