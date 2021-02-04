/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react'
import config from '../config'
import styleSheet from './styleSheet'

const style = {
	firstColumn: {
		marginLeft: 20,
	},
	column: {
		textAlign: 'center',
	},
	textRight: {
		textAlign: 'right',
	},
	icon: {
		check: {
			color: styleSheet.theme,
		},
		times: {
			color: 'red',
		},
		exclamation: {
			color: 'orange',
		},
		circle: {
			color: styleSheet.theme,
		},
	},
	battery: {
		full: {
			color: 'green',
		},
		quarter: {
			color: '#ff6600',
		},
		empty: {
			color: 'red',
		},
	},
}

const lbeaconTableColumn = [
	{
		Header: 'health status',
		accessor: 'health_status',
		width: 100,
		style: style.textRight,
		Cell: (props) =>
			config.HEALTH_STATUS_MAP[props.value]
				? config.HEALTH_STATUS_MAP[props.value]
				: props.value,
	},
	{
		Header: 'product_version',
		accessor: 'product_version',
		width: 150,
		Cell: (props) =>
			config.PRODUCT_VERSION_MAP[props.value]
				? config.PRODUCT_VERSION_MAP[props.value]
				: props.value,
	},
	{
		Header: 'UUID',
		accessor: 'uuid',
		width: 400,
	},
	{
		Header: 'description',
		accessor: 'description',
		width: 130,
	},
	{
		Header: 'comment',
		accessor: 'comment',
		width: 130,
	},
	{
		Header: 'room',
		accessor: 'room',
		width: 60,
	},
	{
		Header: 'IP Address',
		accessor: 'ip_address',
		width: 150,
	},
	{
		Header: 'Gateway IP Address',
		accessor: 'gateway_ip_address',
		width: 180,
	},
	{
		Header: 'last reported timestamp',
		accessor: 'last_report_timestamp',
		width: 250,
	},
	{
		Header: 'api version',
		accessor: 'api_version',
	},
]

const gatewayTableColumn = [
	{
		Header: 'health status',
		accessor: 'health_status',
		style: style.textRight,
		width: 100,
		Cell: (props) =>
			config.HEALTH_STATUS_MAP[props.value]
				? config.HEALTH_STATUS_MAP[props.value]
				: props.value,
	},
	{
		Header: 'Unique ID',
		accessor: 'unique_id',
	},
	{
		Header: 'product_version',
		accessor: 'product_version',
		width: 170,
		Cell: (props) =>
			config.PRODUCT_VERSION_MAP[props.value]
				? config.PRODUCT_VERSION_MAP[props.value]
				: props.value,
	},
	{
		Header: 'IP Address',
		accessor: 'ip_address',
		width: 250,
	},
	{
		Header: 'comment',
		accessor: 'comment',
		width: 130,
	},
	{
		Header: 'last report timestamp',
		accessor: 'last_report_timestamp',
		width: 220,
	},
	{
		Header: 'registered timestamp',
		accessor: 'registered_timestamp',
		width: 220,
	},
	{
		Header: 'api version',
		accessor: 'api_version',
	},
	{
		Header: 'abnormal lbeacon list',
		accessor: 'abnormal_lbeacon_list',
	},
]

const agentTableColumn = [
	{
		Header: 'health status',
		accessor: 'health_status',
		style: style.textRight,
		width: 100,
		Cell: (props) =>
			config.HEALTH_STATUS_MAP[props.value]
				? config.HEALTH_STATUS_MAP[props.value]
				: props.value,
	},
	{
		Header: 'area',
		accessor: 'area_id',
	},
	{
		Header: 'port',
		accessor: 'port',
	},
	{
		Header: 'Unique ID',
		accessor: 'unique_id',
	},
	{
		Header: 'IP Address',
		accessor: 'ip_address',
		width: 250,
	},
	{
		Header: 'comment',
		accessor: 'comment',
		width: 130,
	},
	{
		Header: 'last report timestamp',
		accessor: 'last_report_timestamp',
		width: 220,
	},
	{
		Header: 'registered timestamp',
		accessor: 'registered_timestamp',
		width: 220,
	},
]

const TransferredLocationColumn = [
	{
		Header: 'transferred location',
		accessor: 'name',
	},
	{
		Header: 'department',
		accessor: 'department',
	},
]

const trackingTableColumn = [
	{
		Header: 'POUND_SIGN',
		accessor: '_id',
		style: style.column,
		width: 40,
	},
	{
		Header: 'Found',
		accessor: 'found',
		style: style.column,
		width: 60,
		Cell: (props) =>
			props.value ? (
				<i className="fas fa-circle" style={style.icon.circle}></i>
			) : (
				''
			),
	},
	{
		Header: 'Battery',
		accessor: 'battery_indicator',
		style: style.column,
		width: 70,
		Cell: (props) =>
			(props.value === 3 && (
				<i className="fas fa-battery-full" style={style.battery.full}></i>
			)) ||
			(props.value === 2 && (
				<i className="fas fa-battery-quarter" style={style.battery.quarter}></i>
			)) ||
			(props.value === 1 && (
				<i className="fas fa-battery-empty" style={style.battery.empty}></i>
			)),
	},
	{
		Header: 'Alert',
		accessor: 'geofence_type',
		width: 60,
	},
	{
		Header: 'Tag ID',
		accessor: 'mac_address',
		width: 180,
	},
	{
		Header: 'Name',
		accessor: 'name',
		width: 180,
	},
	{
		Header: 'Type',
		accessor: 'type',
		width: 150,
	},
	{
		Header: 'Asset Control Number',
		accessor: 'asset_control_number',
		width: 180,
	},
	{
		Header: 'Status',
		accessor: 'status',
		width: 100,
	},
	{
		Header: 'Last Location',
		accessor: 'location_description',
		width: 160,
	},
	{
		Header: 'Residence Time',
		accessor: 'residence_time',
		width: 300,
	},
	{
		Header: 'Transferred Location',
		accessor: 'transferred_location',
		width: 160,
	},
]

const searchResultTableColumn = [
	{
		Header: 'Type',
		accessor: 'type',
	},
	{
		Header: 'Last Four ACN',
		accessor: 'last_four_acn',
	},
	{
		Header: 'Status',
		accessor: 'status',
	},
	{
		Header: 'Last Location',
		accessor: 'location_description',
	},
	{
		Header: 'Residence Time',
		accessor: 'residence_time',
	},
]

const patientTableColumn = [
	{
		Header: 'Name',
		accessor: 'name',
		width: 150,
	},
	{
		Header: 'Nickname',
		accessor: 'nickname',
		width: 150,
	},
	{
		Header: 'Tag ID',
		accessor: 'mac_address',
		width: 200,
		Cell: (props) =>
			!props.original.isBind ? (
				<div className="color-blue text-underline">{props.value}</div>
			) : (
				props.value
			),
	},
	{
		Header: 'patient Number',
		accessor: 'asset_control_number',
		width: 200,
	},
	{
		Header: 'auth Area',
		accessor: 'area_name.label',
		width: 150,
	},
	{
		Header: 'room',
		accessor: 'room',
		width: 100,
	},
	{
		Header: 'registered timestamp',
		accessor: 'registered_timestamp',
		width: 300,
	},
]

const visitorTableColumn = [
	{
		Header: 'Name',
		accessor: 'name',
		width: 150,
	},
	{
		Header: 'Nickname',
		accessor: 'nickname',
		width: 150,
	},
	{
		Header: 'Tag ID',
		accessor: 'mac_address',
		width: 200,
		Cell: (props) =>
			!props.original.isBind ? (
				<div className="color-blue text-underline">{props.value}</div>
			) : (
				props.value
			),
	},
	{
		Header: 'auth Area',
		accessor: 'area_name.label',
		width: 150,
	},
	{
		Header: 'registered timestamp',
		accessor: 'registered_timestamp',
		width: 300,
	},
]

const importTableColumn = [
	{
		Header: 'Name',
		accessor: 'name',
		width: 200,
	},
	{
		Header: 'Type',
		accessor: 'type',
		width: 200,
	},
	{
		Header: 'Asset Control Number',
		accessor: 'asset_control_number',
		width: 200,
	},
]

const objectTableColumn = [
	{
		Header: 'Name',
		accessor: 'name',
	},
	{
		Header: 'Alias',
		accessor: 'type_alias',
	},
	{
		Header: 'Type',
		accessor: 'type',
	},
	{
		Header: 'Tag ID',
		accessor: 'mac_address',
		width: 200,
		Cell: (props) =>
			!props.original.isBind ? (
				<div className="color-blue text-underline">{props.value}</div>
			) : (
				props.value
			),
	},
	{
		Header: 'Asset Control Number',
		accessor: 'asset_control_number',
		width: 200,
	},
	{
		Header: 'area',
		accessor: 'area_name.label',
	},
	{
		Header: 'Status',
		accessor: 'status.label',
		width: 150,
	},
	{
		Header: 'registered timestamp',
		accessor: 'registered_timestamp',
	},
]

const shiftChangeCheckTableColumn = [
	{
		Header: 'Position',
		accessor: 'found_text',
		width: 100,
	},
	{
		Header: 'Name',
		accessor: 'name',
		width: 'auto',
	},
	{
		Header: 'Last Location',
		accessor: 'location_description',
		width: 'auto',
	},
	{
		Header: 'Asset Control Number',
		accessor: 'asset_control_number',
		width: 200,
	},
	{
		Header: 'Status',
		accessor: 'status.label',
		width: 50,
	},
	{
		Header: 'Transferred Location',
		accessor: 'transferred_location.label',
		width: 100,
	},
]

const geofenceTableColumn = [
	{
		Header: 'Tag ID',
		accessor: 'mac_address',
		width: 180,
	},
	{
		Header: 'Type',
		accessor: 'type',
		width: 100,
	},
	{
		Header: 'UUID',
		accessor: 'uuid',
	},
	{
		Header: 'Receive Time',
		accessor: 'receive_time',
		width: 200,
	},
	{
		Header: 'Alert Time',
		accessor: 'alert_time',
		width: 200,
	},
	{
		Header: 'Name',
		accessor: 'name',
		width: 200,
	},
]

const userInfoTableColumn = [
	{
		Header: 'POUND_SIGN',
		accessor: '_id',
		style: style.column,
		width: 60,
	},
	{
		Header: 'Name',
		accessor: 'name',
		resizable: false,
		width: 150,
	},
	{
		Header: 'email',
		accessor: 'email',
		width: 200,
	},
	{
		Header: 'user id',
		accessor: 'id',
		width: 70,
	},
	{
		Header: 'Roles',
		accessor: 'roleName',
		width: 200,
	},
	{
		Header: 'service areas',
		accessor: 'areasName',
		width: 300,
	},
	{
		Header: 'last visited timestamp',
		accessor: 'last_visit_timestamp',
		width: 250,
	},
	{
		Header: 'registered timestamp',
		accessor: 'registered_timestamp',
		width: 250,
	},
]

const editObjectRecordTableColumn = [
	{
		Header: 'Name',
		accessor: 'name',
		width: 100,
	},
	{
		Header: 'edit time',
		accessor: 'edit_time',
		width: 230,
	},
	{
		Header: 'new status',
		accessor: 'new_status',
		width: 180,
	},
	{
		Header: 'Notes',
		accessor: 'notes',
	},
]

const shiftChangeRecordTableColumn = [
	{
		Header: 'user name',
		accessor: 'user_name',
		width: 150,
	},
	{
		Header: 'shift',
		accessor: 'shift',
		width: 140,
	},
	{
		Header: 'submit timestamp',
		accessor: 'submit_timestamp',
	},
]

const deviceManagerTableColumn = [
	{
		Header: 'Name',
		accessor: 'name',
	},
	{
		Header: 'Type',
		accessor: 'type',
	},
	{
		Header: 'Access Control Number',
		accessor: 'asset_control_number',
	},
	{
		Header: 'Status',
		accessor: 'status',
		width: 100,
	},
	{
		Header: 'Transferred Location',
		accessor: 'transferred_location',
	},
]

const geofenceConfigColumn = [
	{
		Header: 'enable',
		accessor: 'enable',
		width: 60,
		style: style.column,
		Cell: (props) =>
			props.value ? (
				<i className="fas fa-circle" style={style.icon.circle}></i>
			) : (
				''
			),
	},
	{
		Header: 'is global fence',
		accessor: 'is_global_fence',
		width: 100,
		Cell: (props) =>
			props.value ? (
				<i className="fas fa-circle" style={style.icon.circle}></i>
			) : (
				''
			),
	},
	{
		Header: 'area',
		accessor: 'area.label',
		width: 150,
	},
	{
		Header: 'name',
		accessor: 'name',
		width: 100,
	},
	{
		Header: 'enable start time',
		accessor: 'start_time',
		width: 90,
	},
	{
		Header: 'enable end time',
		accessor: 'end_time',
		width: 90,
	},
	{
		Header: 'perimeter rssi',
		accessor: 'p_rssi',
		width: 120,
	},
	{
		Header: 'fence rssi',
		accessor: 'f_rssi',
		width: 120,
	},
]

const monitorConfigColumn = [
	{
		Header: 'enable',
		accessor: 'enable',
		width: 70,
		style: style.column,
		Cell: (props) =>
			props.value ? (
				<i className="fas fa-circle" style={style.icon.circle}></i>
			) : (
				''
			),
	},
	{
		Header: 'area',
		accessor: 'area.label',
		width: 230,
	},
	{
		Header: 'enable start time',
		accessor: 'start_time',
		width: 130,
	},
	{
		Header: 'enable end time',
		accessor: 'end_time',
		width: 130,
	},
]

const locationHistoryByNameColumns = [
	{
		Header: 'area',
		accessor: 'area',
		width: 230,
	},
	{
		Header: 'start time',
		accessor: 'startTime',
		width: 300,
	},
	{
		Header: 'end time',
		accessor: 'endTime',
		width: 300,
	},
	{
		Header: 'residence time',
		accessor: 'residenceTime',
	},
]

const locationHistoryByNameGroupByUUIDColumns = [
	{
		Header: 'area',
		accessor: 'area',
		width: 230,
	},
	{
		Header: 'start time',
		accessor: 'startTime',
		width: 300,
	},
	{
		Header: 'end time',
		accessor: 'endTime',
		width: 300,
	},
	{
		Header: 'residence time',
		accessor: 'residenceTime',
	},
]

const locationHistoryByNameGroupBYUUIDColumns = [
	{
		Header: 'area',
		accessor: 'area',
		width: 230,
	},
	{
		Header: 'description',
		accessor: 'location_description',
		width: 180,
	},
	{
		Header: 'UUID',
		accessor: 'uuid',
		width: 450,
	},
	{
		Header: 'start time',
		accessor: 'startTime',
		width: 300,
	},
	{
		Header: 'end time',
		accessor: 'endTime',
		width: 300,
	},
	{
		Header: 'residence time',
		accessor: 'residenceTime',
	},
]

const locationHistoryByUUIDColumns = [
	{
		Header: 'POUND_SIGN',
		accessor: 'id',
		width: 50,
	},
	{
		Header: 'name',
		accessor: 'name',
		width: 250,
	},
	{
		Header: 'mac address',
		accessor: 'mac_address',
		width: 250,
	},
	{
		Header: 'area',
		accessor: 'area',
		width: 250,
	},
	{
		Header: 'description',
		accessor: 'location_description',
		width: 200,
	},
]

const locationHistoryByAreaColumns = [
	{
		Header: 'POUND_SIGN',
		accessor: 'id',
		width: 50,
	},
	{
		Header: 'name',
		accessor: 'name',
		width: 250,
	},
	{
		Header: 'mac address',
		accessor: 'mac_address',
		width: 250,
	},
	{
		Header: 'area',
		accessor: 'area',
		width: 250,
	},
]

export {
	lbeaconTableColumn,
	gatewayTableColumn,
	agentTableColumn,
	objectTableColumn,
	shiftChangeCheckTableColumn,
	importTableColumn,
    patientTableColumn,
    visitorTableColumn,
	userInfoTableColumn,
	locationHistoryByNameColumns,
	locationHistoryByNameGroupByUUIDColumns,
	locationHistoryByNameGroupBYUUIDColumns,
	locationHistoryByUUIDColumns,
	locationHistoryByAreaColumns,
	trackingTableColumn,
	searchResultTableColumn,
	TransferredLocationColumn,
	geofenceTableColumn,
	editObjectRecordTableColumn,
	shiftChangeRecordTableColumn,
	deviceManagerTableColumn,
	geofenceConfigColumn,
	monitorConfigColumn,
}
