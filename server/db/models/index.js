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
import UserTable from './user-table'
import UserArea from './user-area'
import UserRole from './user-role'
import AgentTable from './agent-table'
import LBeaconTable from './lbeacon-table'
import VitalSignSummaryTable from './vital-sign-summary-table'
import VitalSignConfig from './vital-sign-config'
import GatewayTable from './gateway-table'

NamedList.hasMany(ObjectNamedListMappingTable, { as: 'objectIds' })
ObjectNamedListMappingTable.belongsTo(NamedList)

ObjectTable.belongsTo(AreaTable, {
	foreignKey: 'area_id',
	as: 'area',
})
ObjectTable.belongsTo(TransferLocations, {
	foreignKey: 'transferred_location',
	as: 'transferLocations',
})
ObjectTable.belongsTo(UserTable, {
	foreignKey: 'physician_id',
	as: 'user',
})
ObjectTable.hasOne(ObjectSummaryTable, {
	foreignKey: 'mac_address',
	sourceKey: 'mac_address',
	as: 'extend',
})
ObjectSummaryTable.belongsTo(ObjectTable, {
	foreignKey: 'mac_address',
	targetKey: 'mac_address',
})
ObjectTable.hasOne(VitalSignSummaryTable, {
	foreignKey: 'mac_address',
	sourceKey: 'mac_address',
	as: 'vitalSign',
})
VitalSignSummaryTable.belongsTo(ObjectTable, {
	foreignKey: 'mac_address',
	targetKey: 'mac_address',
})

ObjectSummaryTable.hasOne(LBeaconTable, {
	foreignKey: 'uuid',
	sourceKey: 'uuid',
	as: 'lbeacon',
})
LBeaconTable.belongsTo(ObjectSummaryTable, {
	foreignKey: 'uuid',
	targetKey: 'uuid',
})

UserAssignments.belongsTo(DeviceGroupList, { foreignKey: 'group_list_id' })
UserAssignments.belongsTo(PatientGroupList, { foreignKey: 'group_list_id' })

UserTable.belongsToMany(AreaTable, {
	through: UserArea,
	as: 'areas',
	foreignKey: 'user_id',
})
AreaTable.belongsToMany(UserTable, {
	through: UserArea,
	as: 'users',
	foreignKey: 'area_id',
})

const MonitorTypeEnum = {
	NORMAL: 0,
	GEO_FENCE: 1,
	EMERGENCY: 2,
	ACTIVITY: 4,
	LOCATION: 8,
	BED_CLEARNESS: 16,
	VITAL_SIGN: 32,
}

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
	UserArea,
	UserTable,
	UserRole,
	AgentTable,
	LBeaconTable,
	VitalSignSummaryTable,
	VitalSignConfig,
	GatewayTable,
	UserAssignmentEnum,
	MonitorTypeEnum,
}
