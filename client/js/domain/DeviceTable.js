import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../config'
import { objectTableColumn } from '../config/tables'
import { DEVICE } from '../config/wordMap'
import { ADDITION_OPTION } from './EditForm'
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
			objectApiMode={DEVICE}
			addText={'ADD_DEVICE'}
			deleteText={'DELETE_DEVICE'}
			additionOptionType={ ADDITION_OPTION.DEVICE }
		/>
	)
}

export default DeviceTable
