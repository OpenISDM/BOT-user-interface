import React from 'react'
import 'react-table/react-table.css'
import { Nav, Tab } from 'react-bootstrap'
import 'react-tabs/style/react-tabs.css'
import { AppContext } from '../../../context/AppContext'
import ObjectTable from '../../presentational/ObjectTable'
import PatientTable from '../../presentational/PatientTable'

import {
	BOTContainer,
	BOTNavLink,
	BOTNav,
	PageTitle,
} from '../../../components/BOTComponent/styleComponent'
import TrackingTable from '../../../components/container/TrackingTable'

class ObjectManagementContainer extends React.Component {
	static contextType = AppContext

	defaultActiveKey = 'devices_table'

	render() {
		const { locale } = this.context

		return (
			<BOTContainer>
				<PageTitle>{locale.texts.OBJECT_MANAGEMENT}</PageTitle>
				<Tab.Container defaultActiveKey={this.defaultActiveKey}>
					<BOTNav>
						<Nav.Item>
							<BOTNavLink secondary eventKey="devices_table">
								{locale.texts.DEVICE_FORM}
							</BOTNavLink>
						</Nav.Item>
						<Nav.Item>
							<BOTNavLink secondary eventKey="patients_table">
								{locale.texts.PATIENT_FORM}
							</BOTNavLink>
						</Nav.Item>
						<Nav.Item>
							<BOTNavLink secondary eventKey="">
								{locale.texts.STAFF_FORM}
							</BOTNavLink>
						</Nav.Item>
						<Nav.Item>
							<BOTNavLink secondary eventKey="''">
								{locale.texts.VISTOR_FORM}
							</BOTNavLink>
						</Nav.Item>
						<Nav.Item>
							<BOTNavLink secondary eventKey="battery_table">
								{locale.texts.BATTERY_FORM}
							</BOTNavLink>
						</Nav.Item>
					</BOTNav>
					<Tab.Content className="my-3">
						<Tab.Pane eventKey="devices_table">
							<ObjectTable />
						</Tab.Pane>
						<Tab.Pane eventKey="patients_table">
							<PatientTable />
						</Tab.Pane>
						<Tab.Pane eventKey="battery_table">
							<TrackingTable />
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</BOTContainer>
		)
	}
}

export default ObjectManagementContainer
