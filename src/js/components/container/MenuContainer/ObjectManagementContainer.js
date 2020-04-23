import React, { Fragment } from 'react';
import { 
    Fade,
    
} from 'react-transition-group'
import 'react-table/react-table.css'; 
import { 
    Nav,
    Tab,
} from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../../context/AppContext';
import AccessControl from '../../presentational/AccessControl'
import ObjectTable from '../../presentational/ObjectTable'
import PatientTable from '../../presentational/PatientTable'
import ImportObjectTable from '../../presentational/ImportObjectTable'
import ImportPatientTable from '../../presentational/ImportPatientTable' 
import {
    BOTContainer,
    BOTNavLink,
    BOTNav,
    PageTitle
} from '../../BOTComponent/styleComponent'


class ObjectManagementContainer extends React.Component{
    
    static contextType = AppContext

    defaultActiveKey = "patients_table"
    
    render(){

        const { locale } = this.context

        return (     
            <BOTContainer>     
                <PageTitle>                                            
                    {locale.texts.OBJECT_MANAGEMENT}
                </PageTitle>
                <Tab.Container 
                    transition={Fade}
                    defaultActiveKey={this.defaultActiveKey}
                >
                    <BOTNav>
                        <Nav.Item>
                            <BOTNavLink eventKey="patients_table">
                                {locale.texts.TAGS}
                            </BOTNavLink>
                        </Nav.Item>
                        <AccessControl
                            permission={"user:importTable"}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey="import_patients">
                                    {locale.texts.IMPORT_PATIENTS_DATA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                    </BOTNav>
                    <Tab.Content
                        className="my-3"
                    >
                        <Tab.Pane eventKey="patients_table">
                            <PatientTable/>
                        </Tab.Pane>
                        <AccessControl
                            permission={"user:importTable"}
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
