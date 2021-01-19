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
import NotificationTable from './notificationTable'
import ObjectSummaryTable from './objectSummaryTable'
import AreaTable from './areaTable'

NamedList.hasMany(ObjectNamedListMappingTable, { as: 'objectIds' })
ObjectNamedListMappingTable.belongsTo(NamedList)

ObjectTable.hasOne(ObjectSummaryTable, {
	foreignKey: 'mac_address',
	sourceKey: 'mac_address',
	as: 'extend',
})
ObjectSummaryTable.belongsTo(ObjectTable, {
	foreignKey: 'mac_address',
	targetKey: 'mac_address',
})

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
	NotificationTable,
	ObjectSummaryTable,
	AreaTable,
	UserAssignmentEnum,
}
