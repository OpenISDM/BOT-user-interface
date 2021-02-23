import React from 'react'
import ObjectTable, { SELECTION, DATA_METHOD } from './ObjectTable'
import config from '../config'
import EditStaffForm from './EditStaffForm'
import { staffTableColumn } from '../config/tables'
import { PERSON } from '../config/wordMap'

const StaffTable = () => {
	return (
		<ObjectTable
			objectTypes={[config.OBJECT_TYPE.PERSON]}
			objectSubTypes={[
				config.OBJECT_TABLE_SUB_TYPE.STAFF,
				config.OBJECT_TABLE_SUB_TYPE.CONTRACTOR,
			]}
			filteredAttribute={['name', 'area', 'macAddress', 'acn']}
			enabledSelection={[SELECTION.AREA]}
			columns={staffTableColumn}
			EditedForm={EditStaffForm}
			objectApiMode={PERSON}
			addText={'ADD_STAFF'}
			deleteText={'DELETE_STAFF'}
			dataMethod={DATA_METHOD.OBJECT}
			isButtonEnable={true}
		/>
	)
}

export default StaffTable
