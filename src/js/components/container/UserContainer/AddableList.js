import React from 'react';

/** Import Presentational Component */



import ListGroup from 'react-bootstrap/ListGroup';


import { Col, Row } from 'react-bootstrap';
const Fragment = React.Fragment;
export default class AddableList extends React.Component{

    constructor() {
        super();
        this.state = {
            title: "title",
            itemList: []
        }
        this.addNewItem = this.addNewItem.bind(this)
        this.addListByEnter = this.addListByEnter.bind(this)
        this.removeItem = this.removeItem.bind(this)

        this.validation = (item) => {
            return true
        } 

        this.itemLayout = (item) => {
            if(typeof item === 'string'){
                return(
                    <Fragment>
                        {item}
                    </Fragment>
                )    
            }else{
                console.error('the item is an object so you have to set your own itemLayout')
                return 
            }
            
        }

        this.API = {
            setTitle: (title) => {
                this.setState({
                    title: title
                })
            },
            getTitle: (title) => {
                return this.state.title
            },
            getItem: () => {
                return this.state.itemList
            },
            setList: (list) => {
                if(typeof list === 'object'){
                    this.setState({
                        itemList: list
                    })
                }
            },
            removeItem: (item) => {
                this.setState({
                    itemList: _.without(this.state.itemList, item)
                })
                this.Update('remove', item)
            },
            pushItem: (itemValue) => {
                this.setState({
                    itemList: this.state.itemList.push(itemValue)
                })
                
            },
            addItem: () => {
                var {itemList} = this.state
                if(itemList[itemList.length - 1] !== 'add'){
                    itemList.push('add')
                    this.setState({})
                }
            },
            addItemCheck: (item) => {
                var {itemList} = this.state
                if(itemList[itemList.length - 1] === 'add' ){
                    var validationValue = this.validation(item)
                    if(validationValue){
                        itemList.pop()
                        itemList.push(validationValue)
                        this.setState({})
                        this.Update('add', validationValue)
                    }
                }
                            }, 
            whenUpdate: (func) => {
                this.Update = func;
            },
            setValidation: (func) => {
                this.validation = func;
            },
            setOnClick: (func) => {

                this.onClick = func
            },
            setItemLayout: (func) => {
                this.itemLayout = func
            }
        }
    }

    componentDidMount(){
        if(this.props.getAPI){
            this.props.getAPI(this.API)
        }else{
            console.error('please set attributes called "getAPI" for UserSettingContainer')
        }
    }
    
    addNewItem(){    
        this.API.addItem()
    }
    addListByEnter(e){
        if(event.key === 'Enter'){

            var newACN = e.target.value
            this.API.addItemCheck(newACN)
        }
    }
    removeItem(e){
        var ACN = e.target.getAttribute('name')
        this.API.removeItem(ACN)
    }
    render(){
        
        return (
            <Fragment>
                <h4>{this.state.title}</h4>
                <ListGroup  variant = "flush" style={{maxHeight: '50vh', minHeight: '50vh', overflowY: 'scroll'}}>
                    

                    {this.state.itemList !== null 
                        ? 
                            (() => {
                                var {itemList} = this.state
                                var Html = []
                                var acnList = Object.keys(itemList) 

                                for(var acn of acnList){
                                    var html = []
                                    var item = itemList[acn], index = item.access_control_number

                                    if(item === 'add'){
                                        html = (
                                        <div className="py-1 pr-2" key = {index}>

                                                <input  type="text" className="form-control h4 float-left w-75 border-0" onKeyPress={this.addListByEnter}></input>

                                                <h4 className="float-right" name="add" onClick={this.removeItem}>x</h4>
                                        </div>      
                                    )}else{
                                        html = (
                                        <ListGroup.Item key = {index} onClick={this.onClick} name={index} action>
                                            {this.itemLayout(item, index)}
                                        </ListGroup.Item>
                                    )}
                                    Html.push(html)
                                }
                                return Html
                            })()
                        : 
                            null
                    }
                    {
                        // <ListGroup.Item variant="light" action onClick={this.addNewItem}>+ Add More items</ListGroup.Item>
                    }
                    
                </ListGroup> 
            </Fragment>
        )
    }
}