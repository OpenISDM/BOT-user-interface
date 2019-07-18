import React from 'react';
import { Col, Row, ListGroup, Nav, Button } from 'react-bootstrap';


import LocaleContext from '../../context/LocaleContext';


import '../../../css/hideScrollBar.css'
import '../../../css/shadow.css'
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
    var {sectionTitleData, IsShowSection, hasIndexItem, sectionIndexList} = props;


    // console.log(sectionTitleList)
    const style={
        IndexLinkletter:{
            fontSize:'15px',

            padding:'0px 0px 0px 0px',
        },
        SectionIndex: {
            position:'absolute',
            right: '8%',
            width: '8%',
            height:'60vh',
            float:'left',
            margin:'0px',
            padding: '0px',
            overflowY: 'hidden',
        }, 
        SectionList:{
            position:'absolute',
            right: '16%',
            width: '200px',

            height:'60vh',

            float:'left',

            margin:'0px auto',

            overflowY: 'scroll',

            visibility: (props.IsShowSection)?'visible':'hidden',

            boxShadow:'3px 3px 12px gray',
            padding:'0px',
        },
        titleListLetter:{
            background: '#E0E0E0',
        }
    };

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
                    className={ ' sectionIndexItem' + ' px-0'}  
                    style={style.IndexLinkletter}
                    name={sectionIndexList[i]}
                    onMouseOver={props.handleMouseOver} 
                >
                    {(index%2)?sectionIndexList[i]:'.'}
                </Nav.Link>
            ;

            Data.push(data)
        }
        return Data;
    }
    // this function is to generate the html of the sectionTitleList
    function sectionTitleListHTML(){

        var Data = [];
        let first = []; 
        // console.log(sectionTitleData)

        for(var titleData in sectionTitleData){

            if (sectionTitleData[titleData].values().next().value != undefined){

                first = sectionTitleData[titleData].values().next().value.charAt(0).toUpperCase()

                Data.push(<a id={first} key={first} ><ListGroup.Item style={style.titleListLetter}><h5 >{first}</h5></ListGroup.Item></a>)

                for (let i of sectionTitleData[titleData]){

                    Data.push(
                        <ListGroup.Item key={i}>
                        <Button onClick={props.getResultData}  className="my-0 py-0 w-100 btn shadow" style={{background: '#EEEEEE'}}>
                            
                                <h5 style={{color: 'black'}}>{i}</h5>
                            

                        </Button>
                        </ListGroup.Item>
                    )
            }
        }
        
        }       
        return Data

    };

    
    return (
        <div onMouseLeave={props.handleMouseLeave} >
            {
                // this section shows the layout of sectionTitleList (the search results when you hover the section Index List)
            }
            <div id = "SectionList" className="hideScrollBar" style={style.SectionList}>
                {
                    sectionTitleListHTML()
                }
            </div>

            {
                // this section shows the layout of sectionIndexList (Alphabet List)
            }
            <div id = "SectionIndex" style={style.SectionIndex} className = "">
                {
                    sectionIndexHTML()
                }  
            </div>

        </div>
    )
        
    

    

}




export default SearchableObjectType
