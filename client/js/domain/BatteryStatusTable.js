import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../config'
//import EditPatientForm from './EditPatientForm'
import { batteryTableColumn } from '../config/tables'
import EditPatientForm from './EditPatientForm'

const BatteryStatusTable=()=>{
    const {OBJECT_TABLE_SUB_TYPE} = config
    return (
        <ObjectTable
            objectTypes={[config.OBJECT_TYPE.PERSON, config.OBJECT_TYPE.DEVICE]}
            objectSubTypes={[
                OBJECT_TABLE_SUB_TYPE.PATIENT,
                OBJECT_TABLE_SUB_TYPE.VISITOR,
				OBJECT_TABLE_SUB_TYPE.STAFF,
				OBJECT_TABLE_SUB_TYPE.CONTRACTOR,
			]}
            filteredAttribute={['name', 'type', 'area', 'macAddress', 'acn']}
            enabledSelection={[SELECTION.AREA]}
            columns={batteryTableColumn}
            EditedForm={EditPatientForm}
            isButtonEnable={false}
            isTableTappedEnable={false}
        />
    )
}

export default BatteryStatusTable