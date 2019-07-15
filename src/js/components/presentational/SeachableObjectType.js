import React from 'react';


import { Col, Row, ListGroup, Nav } from 'react-bootstrap';


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
            height:'60vh',

            float:'right',

            margin:'0px auto',

            overflowY: 'scroll',
        }, 
        SectionList:{
            height:'60vh',

            float:'left',

            margin:'0px auto',

            overflowY: 'scroll',

            display: (props.IsShowSection)?'block':'none',

            boxShadow:'3px 3px 12px gray',
            padding:'20px',
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
                    className={ ' sectionIndexItem' + ' px-3'}  
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
                        <a onClick={props.getResultData} key={i}>
                            <ListGroup.Item >
                                <h5>{i}</h5>
                            </ListGroup.Item>
                        </a>
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
            <Col id = "SectionList" sm={10} md={10} xs={10} className="hideScrollBar" style={style.SectionList}>
                {
                    sectionTitleListHTML()
                }
            </Col>

            {
                // this section shows the layout of sectionIndexList (Alphabet List)
            }
            <Col id = "SectionIndex" sm={2} md={2} xs={2} style={style.SectionIndex} className = "col-sm-collapse">
                {
                    sectionIndexHTML()
                }  
            </Col>

        </div>
    )
        
    

    

}

export default SearchableObjectType

// <div>
//          <Col id = "SectionList" sm={8} md={8}>
//              {sectionTitleList}
//          </Col>
//          <Col id = "SectionIndex" sm={8} md={8}>
//                  <Nav.Link 
//                     active={false} 
//                     href={'#' + 'letter'} 
//                     onMouseOver={props.handleMouseOver} 
                    
                    
//                 >
//              a
//                 </Nav.Link>
                    
//          </Col>
//      </div>