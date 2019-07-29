import React from 'react';
import { Col, Row, ListGroup, Nav, Button } from 'react-bootstrap';


import LocaleContext from '../../context/LocaleContext';


import '../../../css/hideScrollBar.css'
import '../../../css/shadow.css'
import '../../../css/SearchableObjectType.css'
/*
    this class contain three two components
        1. sectionIndexList : this is the alphabet list for user to search their objects by the first letter of their type
        2. sectionTitleList : when you hover a section Index List letter, the section title list will show a row of object types of same first letter (i.e. bed, bladder scanner, ...) 
*/


const SearchableObjectType = (props) => {
    /* 
        this.props contains several properties : 
            1.sectionTitleData : this is an array contains the alphabet of the Index and the objects belong to it, the first element is a letter, and others are objects
            2.IsShowSection : this decide whether to show the item by MouseOver and MouseLeave events
            3.hasIndexItem : this shows whether a letter contains any object
            4.sectionIndexList : this shows the alphabet letters (i.e. 'A'~'Z')
    */
    var {sectionTitleData} = props;


    var sectionIndexList = ['A','B', 'C', 'D','E','F','G', 'H', 'I','J','K','L', 'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    var IsShowSection = true

    var sectionTitleData = props.sectionTitleData
    

    function handleHoverEvent(e){

        props.getShowSectionState(true)
    }

    function mouseClick(e){

        props.getResultData(e.target.innerHTML)
        props.clickButtonHandler()
    }

    function sectionIndexHTML(){
        var Data = [];
        let data = [];
        let index = 0;
        // the for loop is to screen out the alphabet without any data, output a html format
        for (var i in sectionIndexList){
            index ++;
            data = 
                <Nav.Link 
                    key={i} 
                    active={false} 
                    href={'#' + sectionIndexList[i]} 
                    className='py-0 h6'
                    name={sectionIndexList[i]}
                    onMouseOver={handleHoverEvent} 
                >
                    {(index%2)?sectionIndexList[i]:'.'}
                </Nav.Link>
            ;

            Data.push(data)
        }
        return Data;
    }

    function mouseLeave(){

        props.getShowSectionState(false)
    }

    // this function is to generate the html of the sectionTitleList
    function sectionTitleListHTML(){

        var Data = [];
        let first = []; 

        for(var titleData in sectionTitleData){
            if (sectionTitleData[titleData].values().next().value != undefined){

                first = sectionTitleData[titleData].values().next().value.charAt(0).toUpperCase()

                Data.push(<ListGroup.Item id={first} key={first} className=" text-right text-dark"><strong><h5 className="m-0">{first}</h5></strong></ListGroup.Item>)
                for (let i of sectionTitleData[titleData]){

                    Data.push(
                        <ListGroup.Item key={i} className="my-0 py-0 w-100 text-right" onClick={mouseClick}>
                                <h5>{i}</h5>
                        </ListGroup.Item>
                    )
                }
            }
        
        }       
        return Data

    };

    
    return (

        <div onMouseLeave={mouseLeave} className="hideScrollBar">
            {
                // this section shows the layout of sectionIndexList (Alphabet List)
            }
            <Col  md={4} id = "SectionIndex"  className = "float-right">
                {
                    sectionIndexHTML()
                }  
            </Col>

            {
                // this section shows the layout of sectionTitleList (the search results when you hover the section Index List)

            }
            <div  id = "SectionList" className="hideScrollBar bg-light shadow border border-primary" style={{overflowY: 'scroll'}}>
                {

                    sectionTitleListHTML()
                }
            </div>
            

        </div>
    )
        
    

    

}




export default SearchableObjectType
