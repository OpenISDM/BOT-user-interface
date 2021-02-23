import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../config'
//import EditPatientForm from './EditPatientForm'
import { batteryTableColumn } from '../config/tables'
//import BatteryStatusTable from './BatteryStatusTable'
import EditPatientForm from './EditPatientForm'
import { PERSON } from '../config/wordMap'

const BatteryStatusTable=()=>{
    return (
        <ObjectTable
            objectTypes={[config.OBJECT_TYPE.PERSON, config.OBJECT_TYPE.DEVICE]}
            filteredAttribute={['name', 'type', 'area', 'macAddress', 'acn']}
            enabledSelection={[SELECTION.AREA]}
            columns={batteryTableColumn}
            EditedForm={EditPatientForm}
            objectApiMode={PERSON}
            isButtonEnable={false}
        />
    )
}

export default BatteryStatusTable