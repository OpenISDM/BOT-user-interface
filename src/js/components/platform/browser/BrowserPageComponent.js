import React from 'react'
import {
    Tab,
    Nav,
    ListGroup
} from 'react-bootstrap'
import {
    BOTContainer,
    PageTitle,
    BOTNav,
    BOTNavLink,
    BOTSideNavTitle,
    BOTSideNav
} from '../../BOTComponent/styleComponent'
import LocaleContext from '../../../context/LocaleContext'
import AccessControl from '../../presentational/AccessControl'

const BrowserPageComponent = ({
    containerModule,
    setMessage
}) => {

    let locale = React.useContext(LocaleContext)

    let {
        tabList,
        title,
        defaultActiveKey
    } = containerModule

    return (
        <Tab.Container 
            transition={false} 
            defaultActiveKey={defaultActiveKey}
        >
            <div 
                className="BOTsidenav"
            >
                <BOTSideNavTitle>
                    {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                </BOTSideNavTitle>
                <ListGroup>
                    {tabList.map((tab, index) => {
                        return (
                            <BOTSideNav
                                key={index}
                                eventKey={tab.name.replace(/ /g, '_')}
                                action
                            >
                                {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                            </BOTSideNav>
                        )
                    })}  
                </ListGroup>  
                
            </div>
            <div
                className="BOTsidemain"
            >
                <Tab.Content>
                {tabList.map((tab, index) => {
                    let props = {
                        type: tab.name,
                        setMessage,
                    }
                    return (
                        <Tab.Pane 
                            eventKey={tab.name.replace(/ /g, '_')}
                            key={tab.name.replace(/ /g, '_')}
                        >
                            <PageTitle>
                                {locale.texts[tab.name.toUpperCase().replace(/ /g, '_')]}
                            </PageTitle>
                            <hr/>
                            {tab.component(props)}
                        </Tab.Pane>
                    )
                })}
                </Tab.Content>         
            </div>
        </Tab.Container>
    )
}
export default BrowserPageComponent
