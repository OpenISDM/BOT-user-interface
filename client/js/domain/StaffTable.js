import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../config'
import { staffTableColumn } from '../config/tables'
import { PERSON } from '../config/wordMap'
import { ADDITION_OPTION } from './EditForm'
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
			objectApiMode={PERSON}
			addText={'ADD_STAFF'}
			deleteText={'DELETE_STAFF'}
			additionOptionType={ADDITION_OPTION.STAFF}
		/>
	)
}

export default StaffTable
