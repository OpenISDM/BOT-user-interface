import React from 'react'
import config from '../config'

const style = {
    column: {
        textAlign: "center",
    },
    textRight: {
        textAlign: "right"
    },
    icon: {
        check: {
            color: "green",
        },
        times: {
            color: "red",
        },
        exclamation: {
            color: "orange",
        },
        circle: {
            color: "green",
        }
    },
    battery:{
        full: {
            color: "green",
        },
        half: {
            color: "orange",
        },
        empty: {
            color: "red",
        }
    }
}


const lbeaconTableColumn = [

    // {
    //     Header: "status",
    //     accessor: "health_status",
    //     width: 60,
    //     style: style.column,
    //     Cell: props => props.value 
    //         ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i>
    //         : <i className="fas fa-times-circle" style={style.icon.times}></i>
    // },
    {
        Header: "health status",
        accessor: "health_status",
        width: 70,
        style: style.textRight,
        Cell: props => config.healthStatusMap[props.value] ? config.healthStatusMap[props.value] : props.value
    },
    {
        Header: "product_version",
        accessor: "product_version",
        width: 130,
        Cell: props => config.productVersionMap[props.value] ?  config.productVersionMap[props.value] : props.value
    },
    {
        Header: "danger area",
        accessor: "danger_area",
        width: 100,
        style: style.column,
        Cell: props => props.value 
            ? <i className="fas fa-circle" style={style.icon.circle}></i>
            : null
    },
    {
        Header: "UUID",
        accessor: "uuid",
        width: 400
    },
    {
        Header: "description",
        accessor: "description",
        width: 130
    },
    {
        Header: "room",
        accessor: "room",
        width: 60,
    },
    {
        Header: "IP Address",
        accessor: "ip_address",
        width: 150
    },
    {
        Header: "Gateway IP Address",
        accessor: "gateway_ip_address",
        width: 180
    },
    {
        Header: "Last Report Timestamp",
        accessor: "last_report_timestamp",
        width: 200,
    },
    {
        Header: "api version",
        accessor: 'api_version',
    },
    {
        Header: "server time offset",
        accessor: "server_time_offset",
    },
]

const gatewayTableColumn = [
    // {
    //     Header: "Status",
    //     accessor: "health_status",
    //     width: 60,
    //     style: style.column,
    //     Cell: props => !props.value 
    //         ? <i className="fas fa-check-circle text-center" style={style.icon.check}></i> 
    //         : <i className="fas fa-times-circle" style={style.icon.times}></i>
    // },
    {
        Header: "health status",
        accessor: "health_status",
        style: style.textRight,
        width: 120,
        Cell: props => config.healthStatusMap[props.value] ? config.healthStatusMap[props.value] : props.value
    },
    {
        Header: "product_version",
        accessor: "product_version",
        width: 170,
        Cell: props => config.productVersionMap[props.value] ?  config.productVersionMap[props.value] : props.value
    },
    {
        Header: "IP Address",
        accessor: "ip_address",
        width: 250
    },
    {
        Header: "Last Report Timestamp",
        accessor: "last_report_timestamp",
        width: 300,
    },
    {
        Header: "Registered Timestamp",
        accessor: "registered_timestamp",
        width: 300,
    },
    {
        Header: "api version",
        accessor: 'api_version',
    },
    {
        Header: "abnormal lbeacon list",
        accessor: "abnormal_lbeacon_list",
    }
]

const TransferredLocationColumn =[
    {
        label: '',
        field: 'fold',
        sort: "asc",
        width: 200
      },
      {
        label: 'level',
        field: 'level',
        width: 200
      },
      {
        label: 'name',
        field: 'name',
        width: 200
      },
      {
          label: 'remove',
          field: 'remove',
          width: 200
      },
      {
          label: 'add',
          field: 'add',
          width: 200
      },
]

const trackingTableColumn = [
    {
        Header: "POUND_SIGN",
        accessor: "_id",
        style: style.column,
        width: 40,
    },
    {
        Header: "Found",
        accessor: "found",
        style: style.column,
        width: 60,
        Cell: props => props.value 
            ? <i className="fas fa-circle" style={style.icon.circle}></i>
            : ""
    },
    {
        Header: "Battery",
        accessor: "battery_indicator",
        style: style.column,
        width: 70,
        Cell: props => 
            props.value === 3 && <i  className="fas fa-battery-full" style={style.battery.full}></i> ||
            props.value === 2 && <i className="fas fa-battery-half" style={style.battery.half}></i> ||
            props.value === 1 && <i className="fas fa-battery-empty" style={style.battery.empty}></i>
    },
    {
        Header: "Panic",
        accessor: "panic",
        width: 60,
        style: style.column,
        Cell: props => props.value ? <i className="fas fa-exclamation" style={style.icon.exclamation}></i> : null
    },
    {
        Header: "Alert",
        accessor: "geofence_type",
        width: 60,
    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 180,
    },
    {
        Header: "Name",
        accessor: "name",
        width: 180
    },
    {
        Header: "Type",
        accessor: "type",
        width: 150
    },
    {
        Header: "Asset Control Number",
        accessor: "asset_control_number",
        width: 180
    },
    {
        Header: "Status",
        accessor: "status",
        width: 100,
    },
    {
        Header: "Last Location",
        accessor: "location_description",
        width: 160
    },
    {
        Header: "Residence Time",
        accessor: "residence_time",
        width: 300,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location",
        width: 160
    },
]

const searchResultTableColumn = [
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Last Four ACN",
        accessor: "last_four_acn"
    },
    {
        Header: "Status",
        accessor: "status"
    },
    {
        Header: "Last Location",
        accessor: "location_description"
    },
    {
        Header: "Residence Time",
        accessor: "residence_time"
    },
]

const patientTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 250
    },
    {
        Header: "ID",
        accessor: "asset_control_number",
        width: 250,
    },
    {
        Header: "area",
        accessor: "area_name.label",
        width: 200,
    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 250,
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp",
        width: 300,
    }
]

const importTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 200,
    },
    {
        Header: "Type",
        accessor: "type",
        width: 200,
    },
    {
        Header: "ID",
        accessor: "asset_control_number",
        width: 200,
    },
]

const objectTableColumn = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Asset Control Number",
        accessor: "asset_control_number",
        width: 200,

    },
    {
        Header: "Mac Address",
        accessor: "mac_address",
    },
    {
        Header: "area",
        accessor: "area_name.label"
    },
    {
        Header: "Status",
        accessor: "status.label",
        width: 150,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location.label"
    },
    {
        Header: "Monitor Type",
        accessor: "monitor_type"
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp"
    }
]

const geofenceTableColumn = [
    {
        Header: "Mac Address",
        accessor: "mac_address",
        width: 180,
    },
    {
        Header: "Type",
        accessor: "type",
        width: 100,
    },
    {
        Header: "UUID",
        accessor: "uuid"
    },
    {
        Header: "Receive Time",
        accessor: "receive_time",
        width: 200,
    },
    {
        Header: "Alert Time",
        accessor: "alert_time",
        width: 200,
    },
    {
        Header: "Name",
        accessor: "name",
        width: 200,
    },
]

const userInfoTableColumn = [
    {
        Header: "POUND_SIGN",
        accessor: "_id",
        style: style.column,
        width: 60,
    },
    {
        Header: "Name",
        accessor: "name",
        resizable: false,
        width: 150,
    },
    {
        Header: "user id",
        accessor: 'id',
        width: 50,
    },
    {
        Header: "Roles",
        accessor: "roles",
        width: 150,
    },
    {
        Header: "Main Area",
        accessor: "main_area",
        width: 150,
    },
    {
        Header: "secondary areas",
        accessor: "area_ids",
        width: 200,
    },
    {
        Header: "last visit timestamp",
        accessor: "last_visit_timestamp",
        width: 250
    },
    {
        Header: "registered timestamp",
        accessor: "registered_timestamp",
        width: 250,
    },
    
]

const editObjectRecordTableColumn = [
    {
        Header: "Name",
        accessor: "name",
        width: 100,
    },
    {
        Header: "edit time",
        accessor: "edit_time",
        width: 230,
    },
    {
        Header: "new status",
        accessor: "new_status",
        width: 180,
    },
    {
        Header: "Notes",
        accessor: "notes",
    },
]

const shiftChangeRecordTableColumn = [
    {
        Header: "user name",
        accessor: "user_name",
        width: 150,
    },
    {
        Header: "shift",
        accessor: "shift",
        width: 140,
    },
    {
        Header: "submit timestamp",
        accessor: "submit_timestamp",
        // width: 200,
    }
]

const deviceManagerTableColumn = [
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Type",
        accessor: "type"
    },
    {
        Header: "Access Control Number",
        accessor: "asset_control_number"
    },
    {
        Header: "Status",
        accessor: "status",
        width: 100,
    },
    {
        Header: "Transferred Location",
        accessor: "transferred_location"
    }, 
]

const geofenceConfigColumn = [
    {
        Header: "enable",
        accessor: "enable",
        width: 60,
        style: style.column,
        Cell: props => props.value 
            ? <i className="fas fa-circle" style={style.icon.circle}></i>
            : ""
    },
    {
        Header: "is global fence",
        accessor: "is_global_fence",
        width: 100,
        Cell: props => props.value 
            ? <i className="fas fa-circle" style={style.icon.circle}></i>
            : ""
    },
    {
        Header: "area",
        accessor: "area.label",
        width: 150,
    },
    {
        Header: "name",
        accessor: "name",
        width: 100,
    },
    {
        Header: "enable start time",
        accessor: "start_time",
        width: 90,
    },
    {
        Header: "enable end time",
        accessor: "end_time",
        width: 90,
    },
    {
        Header: "perimeters group",
        accessor: "parsePerimeters.lbeacons",
        width: 350,
    },
    {
        Header: "perimeter rssi",
        accessor: "p_rssi",
        width: 120,
    },
    {
        Header: "fences group",
        accessor: "parseFences.lbeacons",
        width: 350,
    },
    {
        Header: "fence rssi",
        accessor: "f_rssi",
        width: 120,
    },
]

const monitorConfigColumn = [
    {
        Header: "enable",
        accessor: "enable",
        width: 70,
        style: style.column,
        Cell: props => props.value 
            ? <i className="fas fa-circle" style={style.icon.circle}></i>
            : ""
    },
    {
        Header: "area",
        accessor: "area.label",
        width: 230,
    },
    {
        Header: "enable start time",
        accessor: "start_time",
        width: 130,
    },
    {
        Header: "enable end time",
        accessor: "end_time",
        width: 130,
    },
]

const locationHistoryByMacColumns = [
    {
        Header: "area",
        accessor: "area",
        width: 180,
    },
    {
        Header: "description",
        accessor: "description",
        width: 180,
    },
    {
        Header: "UUID",
        accessor: "uuid",
        width: 400,
    },
    {
        Header: "start time",
        accessor: "startTime",
        width: 250,
    },
    {
        Header: "end time",
        accessor: "endTime",
        width: 250,
    },
    {
        Header: 'residence time',
        accessor: 'residenceTime',
    }
]

const locationHistoryByUUIDColumns = [
    {
        Header: "POUND_SIGN",
        accessor: "id",
        width: 50,
    },
    {
        Header: "name",
        accessor: "name",
        width: 250,
    },
    {
        Header: "mac address",
        accessor: "mac_address",
        width: 180,
    },
]



export { 
    trackingTableColumn,
    searchResultTableColumn,
    lbeaconTableColumn,
    gatewayTableColumn,
    TransferredLocationColumn,
    objectTableColumn,
    importTableColumn,
    patientTableColumn,
    geofenceTableColumn,
    userInfoTableColumn,
    editObjectRecordTableColumn,
    shiftChangeRecordTableColumn,
    deviceManagerTableColumn,
    geofenceConfigColumn,
    monitorConfigColumn,
    locationHistoryByMacColumns,
    locationHistoryByUUIDColumns
}