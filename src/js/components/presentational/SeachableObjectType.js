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
class SearchableObjectType extends React.Component {

    constructor(){
        super()
        this.state = {
            sectionIndexList: ['A','B', 'C', 'D','E','F','G', 'H', 'I','J','K','L', 'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],

            IsShowSection : false,

            sectionTitleData : [],
            
            changeState: 0,

            ShouldUpdate: 1
        }

       this.handleHoverEvent = this.handleHoverEvent.bind(this)
       this.mouseClick = this.mouseClick.bind(this)
       this.mouseLeave = this.mouseLeave.bind(this)
       this.sectionIndexHTML= this.sectionIndexHTML.bind(this)
       this.sectionTitleListHTML = this.sectionTitleListHTML.bind(this)
    }

    
    

    componentDidMount(){
        this.setState({
            sectionTitleData: this.props.objectTypeList
        })
    }
    

    componentDidUpdate(prepProps, prevState){

        if(this.props.ShouldUpdate !== prepProps.ShouldUpdate){
            this.setState({
                sectionTitleData: this.props.objectTypeList
            })
        }
    }

    handleHoverEvent(e){
        this.setState({
            IsShowSection: true,
        })
    }
    mouseClick(e){
       
        location.href = '#' + e.target.name
        this.props.getResultData(e.target.innerHTML)
        this.setState({
            IsShowSection: false
        })
    }
    mouseLeave(){
        console.log('leave')
        this.setState({
            IsShowSection: false
        })
    }
    sectionIndexHTML(){
        const {sectionIndexList} = this.state
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
                    className='py-0'
                    name={sectionIndexList[i]}
                    onMouseOver={this.handleHoverEvent} 
                    style = {{fontSize: '1rem'}}
                >
                    {(index%2)?sectionIndexList[i]:'.'}
                </Nav.Link>
            ;

            Data.push(data)
        }
        return Data;
    }

    sectionTitleListHTML(){

        var Data = [];
        let first = []; 
        const {sectionTitleData} = this.state
        for(var titleData in sectionTitleData){
            if (sectionTitleData[titleData].values().next().value != undefined){

                first = sectionTitleData[titleData].values().next().value.charAt(0).toUpperCase()

                Data.push(<div id={first} key={first} className=" text-right text-dark" ><strong><h4 className="m-0">{first}</h4></strong></div>)
                for (let i of sectionTitleData[titleData]){

                    Data.push(
                        <div key={i} className="my-0 py-0 w-100 text-right" style={{cursor: 'grab'}}onClick={this.mouseClick} >
                                <h4 className="m-0">{i}</h4>
                        </div>
                    )
                }
            }
        
        }       
        return Data

    };
    render() {

        var  Setting = {
        SectionIndex: {

        } ,
        SectionListBackgroundColor:{

            backgroundColor:'rgba(240, 240, 240, 0.95)',
        },
        SectionList: {
            borderRadius: '3%',
            overflowY: 'scroll', 

            height: '60vh',

            width: '25vw',
            zIndex: (this.state.IsShowSection) ? 1500: 0

        },
        SearchableObjectType:{
            position: 'absolute',
            top: '10vh',
            right: '1%'
            
        }

        }
        return(
            <Col md={6} sm={12} xs={12}
                id='searchableObjectType' 
                onMouseLeave={this.mouseLeave} 
                className="hideScrollBar mx-4 px-0 float-right" 
                style = {{
                    ...Setting.SearchableObjectType,

                }}
            >
                {
                    // this section shows the layout of sectionIndexList (Alphabet List)
                }
                <Col  md={4} id = "SectionIndex"  className = "float-right" style = {{zIndex: (this.props.floatUp)?1070:1}}>
                    {
                        this.sectionIndexHTML()
                    }  
                </Col>

                {
                    // this section shows the layout of sectionTitleList (the search results when you hover the section Index List)

                }
                <div  
                    id = "SectionList" 
                    className="hideScrollBar shadow border border-primary float-right mx-0 px-3 py-2 border-secondary" 
                    style={{
                        ...Setting.SectionListBackgroundColor,
                        ...Setting.SectionList,

                    }}
                >
                    {
                        this.sectionTitleListHTML(Setting)
                    }
                </div>
            </Col>
        )
            
        
    }
}

export default SearchableObjectType
