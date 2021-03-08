import trackingData from './tracking-data'
import lbeacon from './lbeacon'
import gateway from './gateway'
import user from './user'
import object from './object'
import locationHistory from './location-history'
import area from './area'
import file from './file'
import role from './role'
import geofence from './geofence'
import monitor from './monitor'
import record from './record'
import transferredLocation from './transferred-location'
import groupList from './group-list'
import userAssignments from './user-assignments'
import namedList from './named-list'
import notification from './notification'
import agent from './agent'
import vitalSignConfig from './vital-sign'

export default (app) => {
	trackingData(app)
	lbeacon(app)
	gateway(app)
	user(app)
	object(app)
	locationHistory(app)
	area(app)
	file(app)
	role(app)
	geofence(app)
	monitor(app)
	record(app)
	transferredLocation(app)
	groupList(app)
	userAssignments(app)
	namedList(app)
	notification(app)
	agent(app)
	vitalSignConfig(app)
}
