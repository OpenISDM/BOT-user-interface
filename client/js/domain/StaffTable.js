import React, { useContext } from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import { AppContext } from '../context/AppContext'
import config from '../config'
import { staffTableColumn } from '../config/tables'
import { PERSON } from '../config/wordMap'

const StaffTable = () => {
	const { locale } = useContext(AppContext)
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
			typeOption={{
				label: 'TYPE',
				value: 'type',
				idText: 'ID',
			}}
			typeOptions={[
				config.OBJECT_TABLE_SUB_TYPE.STAFF,
				config.OBJECT_TABLE_SUB_TYPE.CONTRACTOR,
			].map((value) => {
				return {
					value,
					label: locale.texts[value.toUpperCase()],
				}
			})}
		/>
	)
}

export default StaffTable
