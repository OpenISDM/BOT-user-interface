import React from 'react';


import { Alert, Tab, ListGroup, Col, Row } from 'react-bootstrap';


import LocaleContext from '../../context/LocaleContext';

import _ from 'lodash';



import config from '../../config';

import Scroll from 'react-scroll'
var scroll = Scroll.animateScroll;
 

const Fragment = React.Fragment;
export default class SearchResultTable extends React.Component {

    constructor(props){

        super(props)

        this.state = {
            searchResult: {
                foundResult: [],
                notFoundResult: [],
            },
            foundMode: 'found',
            selectedMacList: [],
            addTransferDevices: false,


        }

        this.generateResultHTML = this.generateResultHTML.bind(this)
        this.generateResultTableRowHTML = this.generateResultTableRowHTML.bind(this)

        this.generateResultListRowHTML = this.generateResultListRowHTML.bind(this)
        this.handleDisplayMode = this.handleDisplayMode.bind(this)


        this.handleToggleNotFound = this.handleToggleNotFound.bind(this)


        this.API = {
            setFoundMode: (foundMode) => {
                this.setState({
                    foundMode: (foundMode === 'found' || foundMode === 'notFound') ? foundMode : 'found',
                })
            },
            toggleFoundMode: () => {
                this.setState({
                    foundMode: this.state.foundMode === 'found' ? 'notFound' : 'found',
                })
            },
            updateSearchResult: (searchResult) => {

                this.setState({
                    searchResult: searchResult
                })
            },
            updateSelectedMacList: (selectedMacList) => {
                this.setState({
                    selectedMacList: selectedMacList
                })
            },
            updateAddTransferDeviceMode : (Mode) => {
                this.setState({
                    addTransferDevices: Mode,
                })
            },
            setOnClick: (func) => {
                this.itemOnClick = func
            },
            clearAll : () => {
                this.setState({
                    searchResult: {
                        foundResult: [],
                        notFoundResult: [],
                    },
                    selectedMacList: [],

                    addTransferDevices: false,
                    foundMode: 'found',
                })
            },
            toTop : () => {
                location.href = '#top'
            }
        }
    }
    componentDidMount(){
        this.props.getAPI(this.API)
    }

    generateResultListRowHTML(item, index){

        var itemOnClick = this.itemOnClick
        var {addTransferDevices, selectedMacList} = this.state

        var showImage = config.searchResult.showImage

        const style = {
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                float: 'left',
            },
            middleText: {
                paddingLeft: 2,
                paddingRight: 2,
                float: 'left',
                textAlign: 'center',
            },
            lastText: {
                float: 'left',
            },
        }
        let element = 

            <Row key={item.mac_address} className = "w-100" onClick={itemOnClick} name={index}>
                    
                    
                    <div  name={item.mac_address} style={{cursor: 'grab'}} className = "mx-3 h5">{index + 1}.</div>
                    <div  name={item.mac_address} style={{cursor: 'grab'}} className = "mx-3 text-left h5">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            style={{textAlign: 'left', cursor: 'grab'}}

                            onChange={itemOnClick} 
                            checked = {item.mac_address in this.state.selectedMacList ? true: false
                                
                            }
                            id={'check'+item.mac_address}
                            name={item.mac_address}
                        />

                        {addTransferDevices
                            ?   
                                <label className="custom-control-label text-left" style={{cursor: 'grab'}} name={item.mac_address} htmlFor={'check'+item.mac_address}/>
                            :
                                null
                        }

                        {item.type}, is near at {item.location_description}, <br /> 

                        ACN: xxxx-xxxx-{item.last_four_acn},status is {item.status}<br />

                    </div>


                    {showImage
                        ?
                            <img src={config.objectImage[item.type]} style={{cursor: 'grab'}} className="objectImage" alt="image"/>
                        :
                            null
                    }
                
            </Row>

        return element
        
    }
    generateResultTableRowHTML(item, index){

        var itemOnClick = this.itemOnClick
        var {addTransferDevices, selectedMacList} = this.state

        var showImage = config.searchResult.showImage

        const style = {
            firstText: {
                paddingLeft: 15,
                paddingRight: 0,
                float: 'left',
            },
            middleText: {
                paddingLeft: 2,
                paddingRight: 2,
                float: 'left',
                textAlign: 'center',
            },
            lastText: {
                float: 'left',
            },
        }
        const layout = {
            xl: [1, 4, 4, 3]
        }
        let element =
            <ListGroup.Item  action style={style.listItem} className='searchResultList ' eventKey={'found:' + index} key={index} onClick={itemOnClick} name={index}>
            <div className = "w-100" key={item.mac_address}>
                <Col xl={layout.xl[0]} lg={2} md={2} xs={2} className="float-left p-0" style={{cursor: 'grab'}}>{index + 1}</Col>
                
                {addTransferDevices
                    ?   
                        <Fragment>
                            <input
                                type="checkbox"
                                className="custom-control-input float-left p-0"
                                onChange={itemOnClick}
                                checked = {item.mac_address in selectedMacList ? true: false }
                                id={'check'+item.mac_address}
                                name={index}
                                style={{cursor: 'grab', float: 'left'}}


                            />
                            <label className="custom-control-label" name={index} htmlFor={'check'+item.mac_address} />
                        </Fragment>
                    :
                        null 
                }

                <Col xl={layout.xl[1]} lg={3} md={3} xs={4} className="float-left p-0" style={{cursor: 'grab'}} name={index}>{item.type}</Col>
                
                <Col xl={layout.xl[2]} lg={7} md={7} xs={6} className="float-left p-0" style={{cursor: 'grab'}} name={index}>ACN: xxxx-xxxx-{item.last_four_acn}</Col>
                {showImage
                    ?
                        
                            <img src={config.objectImage[item.type]} className="float-left p-0 objectImage" alt="image" style={{cursor: 'grab'}}/>

                    :
                        null
                }
            </div>
            </ListGroup.Item>
        return element
    }
    generateResultHTML(searchResult){

        var resultStyle = config.searchResult.style

        if(searchResult === undefined){
            console.error('search Result is undefined at generateResultTableHTML, ERROR!!!!')
            return null
        }
        
        if(Object.keys(searchResult).length === 0){
            return <h4 className="text-center m-3">No device</h4>
        }else{

            
            let html =      
                <Row className="m-0 p-0 justify-content-center" style={{width:'100%'}}>

                    {
                        (() => {
                            var Html = []
                            var index = 0

                            if(resultStyle === 'table'){
                                for(var item in searchResult){
                                    
                                    var html = this.generateResultTableRowHTML(searchResult[item], index)
                                    index ++;
                                    Html.push(html)
                                }
                            }else if(resultStyle === 'list'){
                                for(var item in searchResult){

                                    var html = this.generateResultListRowHTML(searchResult[item], index)
                                    index ++;
                                    Html.push(html)
                                }
                            }
                            return Html
                        })()
                    }
                </Row>
            
            return  html
            

        }
    }
    handleDisplayMode(){
        var locale = this.context
        var { foundMode} = this.state
        var {foundResult, notFoundResult} = this.state.searchResult
        var mode = config.searchResult.displayMode
        var x;

        if(mode === 'showAll'){
            x = 
                <Fragment>
                    <h5 className=" text-left  text-primary w-100 bg-transparent mx-3"> {locale.DEVICE_FOUND(Object.keys(foundResult).length || 0)}</h5>
                    {
                        this.generateResultHTML(foundResult)
                    }
                    <h5 className=" text-left  text-primary w-100 bg-transparent mx-3"> {locale.DEVICE_NOT_FOUND(Object.keys(notFoundResult).length || 0)}</h5>
                    {
                        this.generateResultHTML(notFoundResult)
                    }
                </Fragment>

        }else if(mode === 'switch'){
            x = 
                <Fragment>
                    <h5 className=" text-left  text-primary w-100 bg-transparent mx-3"> {foundMode === 'found'? locale.DEVICE_FOUND(foundResult.length) : locale.DEVICE_NOT_FOUND(notFoundResult.length)}</h5>
                    {
                        this.generateResultHTML(foundMode === 'found' ? foundResult : notFoundResult)
                    }
                </Fragment>
        }else{
            console.error(`the mode isn't recognized, please modify the config.js file {searchResult.displayMode} to {'switch', 'showAll'}`)
            
        }
        return x 
    }

    handleToggleNotFound(e){
        e.preventDefault()
        this.API.toggleFoundMode()
    }
    render() {
        

        const defaultSetting={
            
            maxHeight: '70vh',
            minHeight: '50vh',
            width: '30%',
            top: '10%',
            right: '5%',

        }
        var Setting = {

            ...defaultSetting,
            ...this.props.Setting,
        }
        return(
            <Fragment>

                {config.searchResult.displayMode === 'switch'
                    ?
                        <h6 onClick ={this.handleToggleNotFound} className="text-left text-primary w-100 bg-transparent mx-3 p-0" style={{maxHeight: '8vh', cursor: 'grab'}}>Show {this.state.foundMode? 'Not Found' : 'Found'} Result</h6>
                    :
                        null
                }
                <Row id = "searchResultTable" className="hideScrollBar justify-content-center w-100 m-0 p-0" ref="searchResultTable" style={{overflowY: 'scroll',maxHeight: Setting.maxHeight !== null ? (parseInt(Setting.maxHeight.slice(0,2)) -12).toString() + 'vh' : null}}>      
                    <div id="top"></div>
                    {
                        this.handleDisplayMode()
                    }
                </Row>
            </Fragment>
        )
    }
}
SearchResultTable.contextType = LocaleContext;

