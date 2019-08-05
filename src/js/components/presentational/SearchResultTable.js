import React from 'react';


import { Alert, Tab, ListGroup, Col, Row } from 'react-bootstrap';


import LocaleContext from '../../context/LocaleContext';

import _ from 'lodash';



import config from '../../config';


const Fragment = React.Fragment;
export default class SearchResultTable extends React.Component {

    constructor(props){
        super(props)
        this.generateResultHTML = this.generateResultHTML.bind(this)
        this.generateResultTableRowHTML = this.generateResultTableRowHTML.bind(this)

        this.generateResultListRowHTML = this.generateResultListRowHTML.bind(this)
        this.handleDisplayMode = this.handleDisplayMode.bind(this)
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){

    }
    
    generateResultListRowHTML(item, index){

        var {addDeviceSelection} = this.props
        var {addTransferDevices} = this.props
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

            <Row key={index} className = "w-100" onClick={addDeviceSelection} name={index}>
                
                
                    <div  name={index} style={{cursor: 'grab'}} className = "mx-3">{index + 1}.</div>
                    <div  name={index} style={{cursor: 'grab'}} className = "mx-3 text-left">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            style={{textAlign: 'left', cursor: 'grab'}}

                            onChange={addDeviceSelection}
                            checked = {item.mac_address in this.props.selectedItem ? true: false
                                
                            }
                            id={'check'+item.mac_address}
                            name={index}
                        />

                        {addTransferDevices
                            ?   
                                <label className="custom-control-label text-left" style={{cursor: 'grab'}} name={index} htmlFor={'check'+item.mac_address}/>
                            :
                                null
                        }

                        {item.type}, is near at {item.location_description}, <br /> 

                        ACN: xxxx-xxxx-{item.last_four_acn},status is {item.status}<br />

                        near at {item.location_description}
                        
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
        var {addDeviceSelection} = this.props
        var {addTransferDevices} = this.props
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
            <ListGroup.Item  action style={style.listItem} className='searchResultList ' eventKey={'found:' + index} key={index} >
            <div className = "w-100" key={item.mac_address}>
                <Col xl={2} lg={2} md={2} xs={2} className="float-left p-0"  onClick={addDeviceSelection} style={{cursor: 'grab'}} name={index}>{index + 1}</Col>
                <Col xl={3} lg={3} md={3} xs={4} className="float-left p-0"  onClick={addDeviceSelection} style={{cursor: 'grab'}} sname={index}>{item.type}</Col>
                {addTransferDevices
                    ?   
                        <Fragment>
                            <input
                                type="checkbox"
                                className="float-left p-0"
                                onChange={addDeviceSelection}
                                checked = {item.mac_address in this.props.selectedItem ? true: false }
                                id={'check'+item.mac_address}
                                name={index}
                                style={{cursor: 'grab'}}
                            />
                            <label name={index} htmlFor={'check'+item.mac_address} />
                        </Fragment>
                    :
                        null 
                }
                <Col xl={4} lg={7} md={7} xs={6} onClick={addDeviceSelection} className="float-left p-0" style={{cursor: 'grab'}} name={index}>ACN: xxxx-xxxx-{item.last_four_acn}</Col>
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
        var {addTransferDevices} = this.props

        var resultStyle = config.searchResult.style

        if(searchResult === undefined){
            console.error('search Result is undefined at generateResultTableHTML, ERROR!!!!')
            return null
        }
        if(searchResult.length === 0){
            return <h1 className="text-center m-3">no searchResult</h1>
        }else{

            return  <Row className="m-0 p-0 justify-content-center" style={{width:'100%'}}>
                {searchResult.map((item,index) => {
                    if(resultStyle === 'table'){
                        var html = this.generateResultTableRowHTML(item, index)
                    }
                    else if(resultStyle === 'list'){
                        var html = this.generateResultListRowHTML(item, index)
                    }
                    
                    return html
                })}
            </Row>

        }
    }
    handleDisplayMode(){
        var locale = this.context
        var {foundResult, notFoundResult, searchResult} = this.props
        var mode = config.searchResult.displayMode
        var x;
        if(mode === 'showAll'){

            x = 
                <Fragment>
                    <h6 className=" text-left  text-primary w-100 bg-transparent"> {locale.DEVICE_FOUND(foundResult.length)}</h6>
                    {
                        this.generateResultHTML(foundResult)
                    }
                    <h6 className=" text-left  text-primary w-100 bg-transparent"> {locale.DEVICE_NOT_FOUND(notFoundResult.length)}</h6>
                    {
                        this.generateResultHTML(notFoundResult)
                    }
                </Fragment>

        }else if(mode === 'switch'){
            x = 
                <Fragment>
                    <h6 className=" text-left  text-primary w-100 bg-transparent"> {this.props.foundMode? locale.DEVICE_FOUND(searchResult.length) : locale.DEVICE_NOT_FOUND(searchResult.length)}</h6>
                    {
                        this.generateResultHTML(searchResult)
                    }
                </Fragment>
        }else{
            console.error(`the mode isn't recognized, please modify the config.js file {searchResult.displayMode} to {'switch', 'showAll'}`)
            
        }
        return x 
    }
    render() {
        

        const defaultSetting={
            
            maxHeight: '70vh',
            minHeight: '50vh',
            width: '25%',
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
                        <h6 onClick ={this.props.handleToggleNotFound} className="text-left text-primary w-100 bg-transparent m-2 p-0" style={{maxHeight: '8vh'}}>Show {this.props.foundMode? 'Not Found' : 'Found'} Result</h6>
                    :
                        null
                }
                <Row id = "searchResultTable" className="hideScrollBar justify-content-center w-100 m-2 p-0" style={{overflowY: 'scroll',maxHeight: (parseInt(Setting.maxHeight.slice(0,2)) -12).toString() + 'vh'}} >      
                    {
                        this.handleDisplayMode()
                    }
                </Row>
            </Fragment>
        )
    }
}
SearchResultTable.contextType = LocaleContext;

