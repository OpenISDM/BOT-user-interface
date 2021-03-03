import React, { useContext } from 'react'
import { gatewayTableColumn } from '../config/tables'
import { GATEWAY } from '../config/wordMap'
import SettingTable from '../components/SettingTable'
import { AppContext } from '../context/AppContext'
const GatewayTable = () => {
	const { locale } = useContext(AppContext)
	return (
		<SettingTable
			columns={gatewayTableColumn}
			objectApiMode={GATEWAY}
			isShowUUID={false}
			isShowDescription={false}
			formTitle={locale.texts.ADD_COMMENT}
		/>
	)
}
export default GatewayTable
