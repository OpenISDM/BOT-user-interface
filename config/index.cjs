/* eslint-disable import/no-commonjs */
module.exports = {
	ReplacePairs: {
		PatientToResident: [
			{ search: /病人/g, replace: '居民' },
			{
				search: /'(.*)patient(.*)',/g,
				replace: (match) => {
					return `${match}`.replace('patient', 'resident')
				},
			},
			{
				search: /'(.*)Patient(.*)',/g,
				replace: (match) => {
					return `${match}`.replace('Patient', 'Resident')
				},
			},
		],
	},
}
