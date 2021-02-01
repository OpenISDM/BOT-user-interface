import React from 'react'
import ObjectTable, { SELECTION } from './ObjectTable'
import config from '../../config'
import EditPatientForm from './form/EditPatientForm'
import { patientTableColumn } from '../../config/tables'
import { PERSON } from '../../config/wordMap'

const PatientTable = () => {
	return (
		<ObjectTable
			objectType={[config.OBJECT_TYPE.PERSON]}
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
