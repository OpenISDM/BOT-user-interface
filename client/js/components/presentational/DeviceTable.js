import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../../config'
import EditObjectForm from './form/EditObjectForm'
import { objectTableColumn } from '../../config/tables'
import { DEVICE } from '../../config/wordMap'

const DeviceTable = () => {
	return (
		<ObjectTable
			objectTypes={[config.OBJECT_TYPE.DEVICE]}
			filteredAttribute={[
				'name',
				'type',
				'area',
				'status',
				'macAddress',
				'acn',
				'transferred_location',
			]}
			enabledSelection={[SELECTION.TYPE, SELECTION.STATUS, SELECTION.AREA]}
			columns={objectTableColumn}
			EditedForm={EditObjectForm}
			objectApiMode={DEVICE}
			addText={'ADD_DEVICE'}
			deleteText={'DELETE_DEVICE'}
		/>
	)
}

export default DeviceTable
