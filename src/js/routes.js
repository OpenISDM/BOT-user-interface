import MainContainer from "./components/container/MainContainer";
import HealthReport from "./components/container/HealthReport";
import Geofence from "./components/container/Geofence";
import ObjectManagementContainer from "./components/container/ObjectManagementContainer";
import SettingContainer from "./components/container/UserContainer/SettingContainer";

const routes = [
    {
        path: '/',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/surveillance',
        component: MainContainer,
        exact: true,
    },
    {
        path: '/page/healthReport',
        component: HealthReport,
        exact: true,
    },
    {
        path: '/page/geofence',
        component: Geofence,
        exact: true,
    },
    {
        path: '/page/objectManagement',
        component: ObjectManagementContainer,
        exact: true,
    },
    {
        path: '/page/Setting',
        component: SettingContainer,
        exact: true,
    },
];

export default routes;