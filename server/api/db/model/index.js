import DeviceGroupList from './deviceGroupList'
import GeoFenceAreaConfig from './geoFenceAreaConfig'
import GeoFenceConfig from './geoFenceConfig'
import NamedList from './namedList'
import NotificationConfig from './notificationConfig'
import ObjectNamedListMappingTable from './objectNamedListMappingTable'
import ObjectTable from './objectTable'
import PatientGroupList from './patientGroupList'
import Roles from './roles'
import TransferLocations from './transferLocations'
import UserAssignments, { UserAssignmentEnum } from './userAssignments'

NamedList.hasMany(ObjectNamedListMappingTable)
ObjectNamedListMappingTable.belongsTo(NamedList)

export {
	DeviceGroupList,
	GeoFenceAreaConfig,
	GeoFenceConfig,
	NamedList,
	NotificationConfig,
	ObjectNamedListMappingTable,
	ObjectTable,
	PatientGroupList,
	Roles,
	TransferLocations,
	UserAssignments,
	UserAssignmentEnum,
}
