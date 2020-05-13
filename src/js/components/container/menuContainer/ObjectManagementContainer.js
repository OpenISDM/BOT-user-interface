import React, { Fragment } from 'react';
import 'react-tabs/style/react-tabs.css';
import { 
    Fade,
} from 'react-transition-group';
import { 
    Nav,
    Tab,
} from 'react-bootstrap';
import { AppContext } from '../../../context/AppContext';
import AccessControl from '../../presentational/AccessControl';
import ImportPatientTable from '../../presentational/ImportPatientTable';
import {
    BOTContainer,
    BOTNavLink,
    BOTNav,
    PageTitle
} from '../../BOTComponent/styleComponent';
import ObjectTableContainer from './ObjectTableContainer';

class ObjectManagementContainer extends React.Component{

    static contextType = AppContext

    defaultActiveKey = 'patients_table'
    
    render(){
        const {
            locale
        } = this.context

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
                            <BOTNavLink eventKey='patients_table'>
                                {locale.texts.PERSONA_LIST}
                            </BOTNavLink>
                        </Nav.Item>
                        <AccessControl
                            permission={'user:importTable'}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Nav.Item>
                                <BOTNavLink eventKey='import_patients'>
                                    {locale.texts.IMPORT_PERSONA}
                                </BOTNavLink>
                            </Nav.Item>
                        </AccessControl>
                    </BOTNav>
                    <Tab.Content
                        className='my-3'
                    >
                        <Tab.Pane eventKey='patients_table'>
                            <ObjectTableContainer/> 
                        </Tab.Pane>
                        <AccessControl
                            permission={'user:importTable'}
                            renderNoAccess={() => null}
                            platform={['browser']}
                        >
                            <Tab.Pane eventKey='import_patients'>
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
