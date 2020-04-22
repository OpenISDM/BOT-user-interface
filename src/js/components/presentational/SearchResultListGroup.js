import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import config from '../../config';
import { AppContext } from '../../context/AppContext'
import { 
    getDescription, 
    getMacaddress,
    getRSSI 
} from '../../service/descriptionGenerator'
import AccessControl from './AccessControl'


const SearchResultListGroup = ({
    data,
    onSelect,
    selection,
    disabled,
    action
}) => {

    const { locale } = React.useContext(AppContext);
   
    const style = {
        icon: {
            color: '#007bff',
            top: 10
        },
        item: {
            minWidth: 35,
        },
        listGroup: {
            color: 'rgb(33, 37, 41)',
        }
    }

    return (
        <ListGroup 
            onSelect={onSelect} 
        >
            {data.map((item,index) => {
                let element = 
                    <Link 
                        to={{
                            pathname: '/page/trace',
                            state: {
                                key: {
                                    value: item.name,
                                    label: item.name
                                },
                                mode: 'name'
                            }
                        }}
                        eventKey={item.found + ':'+ index} 
                        key={index} 
                        action={action}
                        active
                        style={style.listGroup}
                        className='d-flex py-1 text-left justify-content-start' 

                    >   
                        <div 
                            style={style.item}
                            className="d-flex justify-content-center"
                        >
                            {selection.indexOf(item.mac_address) >= 0 
                                ?   <i 
                                        className="fas fa-check d-inline-block" 
                                        style={style.icon}
                                    /> 
                                : config.mapConfig.iconOptions.showNumber
                                    ?   <p className='d-inline-block'>{index + 1}.</p>
                                    :   <p className='d-inline-block'>&#9642;</p>
                            }
                        </div>
                        {getDescription(item, locale, config)}
                        {
                            <AccessControl
                                permission={'form:develop'}
                                renderNoAccess={() => null}
                            >
                                {`|${getMacaddress(item, locale)}`}
                            </AccessControl>
                        }
                        {
                            <AccessControl
                                permission={'form:develop'}
                                renderNoAccess={() => null}
                            >
                                {`|${getRSSI(item, locale)}`}
                            </AccessControl>
                        }
                    </Link>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup