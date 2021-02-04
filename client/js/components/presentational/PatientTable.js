import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../../config'
import EditPatientForm from './form/EditPatientForm'
import { patientTableColumn } from '../../config/tables'
import { PERSON } from '../../config/wordMap'

const PatientTable = () => {
	return (
		<ObjectTable
			objectTypes={[config.OBJECT_TYPE.PERSON]}
			objectSubTypes={[config.OBJECT_TABLE_SUB_TYPE.PATIENT]}
			filteredAttribute={['name', 'area', 'macAddress', 'acn', 'sex']}
			enabledSelection={[SELECTION.AREA]}
			columns={patientTableColumn}
			EditedForm={EditPatientForm}
			objectApiMode={PERSON}
			addText={'ADD_PATIENT'}
			deleteText={'DELETE_PATIENT'}
		/>
	)
}

export default PatientTable
