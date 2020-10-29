import React from 'react'
import 'react-table/react-table.css'
import { Nav, Tab } from 'react-bootstrap'
import 'react-tabs/style/react-tabs.css'
import { AppContext } from '../../../context/AppContext'
import AccessControl from '../../authentication/AccessControl'
import ObjectTable from '../../presentational/ObjectTable'
import PatientTable from '../../presentational/PatientTable'
import ImportObjectTable from '../../presentational/ImportObjectTable'
import ImportPatientTable from '../../presentational/ImportPatientTable'
import {
	BOTContainer,
	BOTNavLink,
	BOTNav,
	PageTitle,
} from '../../../components/BOTComponent/styleComponent'

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
							<BOTNavLink secondary eventKey="''">
								{locale.texts.BATTERY_FORM}
							</BOTNavLink>
						</Nav.Item>
						<AccessControl
							permission={'user:importTable'}
							renderNoAccess={() => null}
							platform={['browser']}
						>
							<Nav.Item>
								<BOTNavLink secondary eventKey="import_devices">
									{locale.texts.IMPORT_DEVICES_DATA}
								</BOTNavLink>
							</Nav.Item>
						</AccessControl>
						<AccessControl
							permission={'user:importTable'}
							renderNoAccess={() => null}
							platform={['browser']}
						>
							<Nav.Item>
								<BOTNavLink secondary eventKey="import_patients">
									{locale.texts.IMPORT_PATIENTS_DATA}
								</BOTNavLink>
							</Nav.Item>
						</AccessControl>
					</BOTNav>
					<Tab.Content className="my-3">
						<Tab.Pane eventKey="devices_table">
							<ObjectTable />
						</Tab.Pane>

						<Tab.Pane eventKey="patients_table">
							<PatientTable />
						</Tab.Pane>

						<AccessControl
							permission={'user:importTable'}
							renderNoAccess={() => null}
							platform={['browser']}
						>
							<Tab.Pane eventKey="import_devices">
								<ImportObjectTable />
							</Tab.Pane>
						</AccessControl>
						<AccessControl
							permission={'user:importTable'}
							renderNoAccess={() => null}
							platform={['browser']}
						>
							<Tab.Pane eventKey="import_patients">
								<ImportPatientTable />
							</Tab.Pane>
						</AccessControl>
					</Tab.Content>
				</Tab.Container>
			</BOTContainer>
		)
	}
}

export default ObjectManagementContainer
