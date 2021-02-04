import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../../config'
import EditStaffForm from './form/EditStaffForm'
import { staffTableColumn } from '../../config/tables'
import { PERSON } from '../../config/wordMap'

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
		/>
	)
}

export default StaffTable
