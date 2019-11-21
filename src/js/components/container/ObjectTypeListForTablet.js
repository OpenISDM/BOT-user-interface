import React  from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import { AppContext } from '../../context/AppContext';

class ObjectTypeListForTablet extends React.Component {

    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasGridButton !== this.props.hasGridButton && this.props.hasGridButton) {
            this.setState({
                searchKey: ''
            })
        }
    }

    handleClick = (e) => {
        const itemName = e.target.name.toLowerCase();
        this.getSearchKey(itemName)
    }

    getSearchKey = (itemName) => {
        this.props.getSearchKey(itemName)
        this.setState({
            searchKey: itemName
        })
    }

    render() {
        const { locale, auth } = this.context

        const style = {
            list: {
                maxHeight: "40vh",
                overflow: "hidden scroll"
            }
        }

        return (
            <div id='objectTypeList' >
                <div className='text-capitalize title'>{locale.texts.OBJECT_TYPE}</div>
                <div style={style.list} className="d-inline-flex flex-column justify-content-center searchOption">
                    {this.props.objectTypeList.map((item, index) => {
                        return ( 
                            <Button
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                // active={this.state.searchKey === item.toLowerCase()} 
                                key={index}
                                name={item}
                                className="text-capitalize"
                            >
                                {item}
                            </Button>
                        )
                    })}
                    &nbsp;
                    <AccessControl
                        permission={'user:mydevice'}
                        renderNoAccess={() => null}
                    >
                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick}
                            name = 'my patient'
                        >
                            {locale.texts.MY_PATIENT}
                        </Button>

                        <Button
                            variant="outline-custom"
                            onClick={this.handleClick} 
                            // active={this.state.searchKey === 'my devices'}
                            name='my devices'
                        >
                            {locale.texts.MY_DEVICE}
                        </Button>
                    </AccessControl>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        // active={this.state.searchKey === 'all devices'}
                        name='all patient'
                    >
                        {locale.texts.ALL_PATIENT}
                    </Button>
                    <Button 
                        variant="outline-custom"
                        onClick={this.handleClick} 
                        // active={this.state.searchKey === 'all devices'}
                        name='all devices'
                    >
                        {locale.texts.ALL_DEVICE}
                    </Button>
                </div>
            </div>
        )
    }
}

export default ObjectTypeListForTablet;