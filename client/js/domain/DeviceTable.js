import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../config'
import { objectTableColumn } from '../config/tables'
import { DEVICE } from '../config/wordMap'

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
			typeOption={{
				label: 'TYPE',
				value: 'type',
				idText: 'ACN',
			}}
		/>
	)
}

export default DeviceTable
