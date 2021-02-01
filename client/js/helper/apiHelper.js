import monitorApis from '../apiAgent/monitorApis'
import geofenceApis from '../apiAgent/geofenceApis'
import record from '../apiAgent/recordApiAgent'
import objectApiAgent from '../apiAgent/objectAPiAgent'
import transferredLocationApiAgent from '../apiAgent/transferredLocationApiAgent'
import authApiAgent from '../apiAgent/authApiAgent'
import userApiAgent from '../apiAgent/userApiAgent'
import deviceGroupListApis from '../apiAgent/deviceGroupListApiAgent'
import patientGroupListApis from '../apiAgent/patientGroupListApiAgent'
import trackingDataApiAgent from '../apiAgent/trackingDataApiAgent'
import roleApiAgent from '../apiAgent/roleApiAgent'
import areaApiAgent from '../apiAgent/areaApiAgent'
import lbeaconApiAgent from '../apiAgent/lbeaconApiAgent'
import gatewayApiAgent from '../apiAgent/gatewayApiAgent'
import fileApiAgent from '../apiAgent/fileApiAgent'
import utilsApiAgent from '../apiAgent/utilsApiAgent'
import userAssignmentsApiAgent from '../apiAgent/userAssignmentsApiAgent'
import namedListApiAgent from '../apiAgent/namedListApiAgent'
import notificationApiAgent from '../apiAgent/notificationApiAgent'
import agentApiAgent from '../apiAgent/agentApiAgent'

const apiHelper = {
	areaApiAgent,
	authApiAgent,
	deviceGroupListApis,
	fileApiAgent,
	gatewayApiAgent,
	geofenceApis,
	lbeaconApiAgent,
	monitor: monitorApis,
	objectApiAgent,
	patientGroupListApis,
	record,
	roleApiAgent,
	trackingDataApiAgent,
	transferredLocationApiAgent,
	userApiAgent,
	utilsApiAgent,
	userAssignmentsApiAgent,
	namedListApiAgent,
	notificationApiAgent,
	agentApiAgent,
}

export default apiHelper
