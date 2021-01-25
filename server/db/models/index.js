import DeviceGroupList from './device-group-list'
import GeoFenceAreaConfig from './geofence-area-config'
import GeoFenceConfig from './geofence-config'
import NamedList from './named-list'
import NotificationConfig from './notification-config'
import ObjectNamedListMappingTable from './object-named-list-mapping-table'
import ObjectTable from './object-table'
import PatientGroupList from './patient-group-list'
import Roles from './roles'
import TransferLocations from './transfer-locations'
import UserAssignments, { UserAssignmentEnum } from './user-assignments'
import NotificationTable from './notification-table'
import ObjectSummaryTable from './object-summary-table'
import AreaTable from './area-table'

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
