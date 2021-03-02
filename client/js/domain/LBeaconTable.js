import React, { useContext } from 'react'
import { lbeaconTableColumn } from '../config/tables'
import SettingTable from '../components/settingTable'
import { LBEACON } from '../config/wordMap'
import { AppContext } from '../context/AppContext'
const LbeaconTable = () => {
	const { locale } = useContext(AppContext)
	return (
		<SettingTable
			columns={lbeaconTableColumn}
			objectApiMode={LBEACON}
			formTitle={locale.texts.EDIT_LBEACON}
		/>
	)
}

export default LbeaconTable
