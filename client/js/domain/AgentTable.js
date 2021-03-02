import React, { useContext } from 'react'
import { agentTableColumn } from '../config/tables'
import { AGENT } from '../config/wordMap'
import SettingTable from '../components/settingTable'
import { AppContext } from '../context/AppContext'

const AgentTable = () => {
	const { locale } = useContext(AppContext)
	return (
		<SettingTable
			columns={agentTableColumn}
			objectApiMode={AGENT}
			isShowUUID={false}
			isShowDescription={false}
			formTitle={locale.texts.ADD_COMMENT}
		/>
	)
}

export default AgentTable
