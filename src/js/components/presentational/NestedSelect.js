import React from 'react';
import {Dropdown, DropdownButton} from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';

import config from '../../config';
class NestedSelect extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this)
    }
    
    componentDidMount(){
    }
    onClick(e){
        this.props.onClick(e.target.name)
    }

    generateNestedSelect(objectList, key){
        key = key || ''
        var Html = []
        for(var i in objectList){
            var child = objectList[i]
            if(typeof child !== 'object'){
                Html.push(
                    <Dropdown.Item 
                        key={key + ', ' + child} 
                        name={key + ', ' + child} 
                        as='button'
                        type='button'
                        bsPrefix='btn-white p-2 m-0 w-100 h4 bg-white border-0'
                        style={{fontSize: '1.5rem'}}
                        onClick = {this.onClick}
                    >
                        {child}
                    </Dropdown.Item>
                )
            }else{
                Html.push(
                    <DropdownButton
                        key={key + ', ' + child.name}
                        drop={'right'}
                        variant="light"
                        title={child.name}
                        id={`dropdown-button-drop-right`}
                        size="lg"
                        bsPrefix='btn-white p-2 m-0 w-100 h4 bg-white border-0'
                        style={{fontSize: '1.5rem'}}
                    > 
                        {this.generateNestedSelect(child.section, key + child.name)}
                    </DropdownButton>
                )
            }
        }
        return (
            Html
        )
    }

    render(){
        return (
            <Dropdown>
                <Dropdown.Toggle id="dropdown-custom-1" varient='light' bsPrefix='dropdown-toggle bg-light text-dark' style={{width:'300px'}}>{this.props.title}</Dropdown.Toggle>
                <Dropdown.Menu bsPrefix='dropdown-menu' style={{width:'200px'}}>
                    {
                        this.generateNestedSelect(config.branches)
                    }
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

NestedSelect.contextType = LocaleContext;
  
export default NestedSelect