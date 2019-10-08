import React  from 'react';
import { Col, ListGroup, Row, Button } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import { connect } from 'react-redux';
import { shouldUpdateTrackingData } from '../../action/action';
import config from '../../config';
import AuthenticationContext from '../../context/AuthenticationContext';
import AccessControl from '../presentational/AccessControl';

class FrequentSearch extends React.Component {
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
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
        }

        const locale = this.context

        return (
            <AuthenticationContext.Consumer className="text-capitalize">
                {auth => (
                    <div className='d-inline-flex flex-column mb-3' id='frequentSearch' >
                        {auth.authenticated && auth.user.searchHistory
                            && auth.user.searchHistory.filter( (item,index) => {
                            return index < config.userPreference.searchHistoryNumber
                        }).map( (item, index) => {
                            return (
                                <Button
                                    variant="outline-custom"
                                    onClick={this.handleClick} 
                                    active={this.state.searchKey === item.name.toLowerCase()} 
                                    key={index}
                                    name={item.name}
                                    className="text-capitalize"
                                >
                                    {item.name}
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
                                active={this.state.searchKey === 'my devices'}
                                name='my devices'
                            >
                                {locale.texts.MY_DEVICE}
                            </Button>
                        </AccessControl>
                        
                        <Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button><Button 
                                variant="outline-custom"
                                onClick={this.handleClick} 
                                active={this.state.searchKey === 'all devices'}
                                name='all devices'
                            >
                                {locale.texts.ALL_DEVICE}
                            </Button>
                    </div>
                )}
            </AuthenticationContext.Consumer>
        )
    }
}

FrequentSearch.contextType = LocaleContext;

const mapDispatchToProps = (dispatch) => {
    return {
        shouldUpdateTrackingData: value => dispatch(shouldUpdateTrackingData(value))
    }
}

export default connect(null, mapDispatchToProps)(FrequentSearch);