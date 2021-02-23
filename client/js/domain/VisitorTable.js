import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../config'
import EditVisitorForm from './EditVisitorForm'
import { visitorTableColumn } from '../config/tables'
import { PERSON } from '../config/wordMap'

const VisitorTable = () => {
	return (
		<ObjectTable
			objectTypes={[config.OBJECT_TYPE.PERSON]}
			objectSubTypes={[config.OBJECT_TABLE_SUB_TYPE.VISITOR]}
			filteredAttribute={['name', 'area', 'macAddress', 'acn']}
			enabledSelection={[SELECTION.AREA]}
			columns={visitorTableColumn}
			EditedForm={EditVisitorForm}
			objectApiMode={PERSON}
			addText={'ADD_VISITOR'}
			deleteText={'DELETE_VISITOR'}
			isButtonEnable={true}
		/>
	)
}

export default VisitorTable
