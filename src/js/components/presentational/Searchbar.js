import React from 'react';
import LocaleContext from '../../context/LocaleContext';
import searchIcon from '../../../img/search.png';
import { Form, Row, Col, Button, ListGroup, Dropdown } from 'react-bootstrap';
import  '../../../css/Searchbar.css';
import AxiosFunction from '../../functions/AxiosFunction';

import config from '../../config';
class Searchbar extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.onChange = this.onChange.bind(this)
    }
    componentDidMount(){
        this.getSearchHistory()
    }
    componentDidUpdate(prepProps) {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                value: '',
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.getResultData(this.state.value);
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    getSearchHistory(){
        const Info = null
        const callBack = (err, res) => {
            if(err){
                console.log(err)
            }else{
                console.log(res)
            }
        }
        const option = {
            default : []
        }
    }
    // generateSearchBarKeyWord(word, key, categories){
    //     console.log(word, key)
    //     var index = word.search(key)
    //     console.log(index)
    //     return (
    //         <Dropdown.Item>
    //             <div className='float-left'>
    //                 {
    //                     word.replace(key, '<b>{key}</b>')
    //                 }
    //             </div>
    //         </Dropdown.Item>
    //     )
    // }
    // onChange(e){
    //     console.log(e.target.value)
    //     var keyWords = config.searchBarKeyWords.type
    //     var candidates = []
    //     for(var keyword of keyWords){
    //         console.log(keyword)
    //         var item = this.generateSearchBarKeyWord(keyword, e.target.value, 'type')
    //         candidates.push(item)
    //     }
    //     this.candidates = candidates
    //     this.setState({})
    // }
    render() {

        const style = {
            form: {
                border: "2px solid rgba(227, 222, 222, 0.447)",
                
                borderRadius : '25px',
                fontSize: '16px',

            },
            input: {
                background: 'rgba(0,0,0,0'
            }
        }

        const { value } = this.state;

        const locale = this.context;

        return (            
            <Form className="d-flex justify-content-center col-xs-8">
                {/* <div className="form-group mx-3">
                    <label htmlFor="inputPassword2" className="sr-only">{locale.search.toUpperCase()}</label>
                    <input type="text" className="form-control-sm border-0" value={value} onChange={this.handleChange}/>
                </div> */}
                {
                    // <Dropdown>
                //     <Dropdown.Toggle bsPrefix="dropdown-toggle p-1 px-3 mx-0 w-100" as='input' id='searchbar' style={{borderRadius: '20px'}} onChange={this.onChange}>
                        
                //     </Dropdown.Toggle>
                //     <Dropdown.Menu bsPrefix="dropdown-menu w-100 shadow" style={{borderRadius: '20px', fontSize: '1.1rem', maxHeight: '20vh', overflowY:'scroll'}}>
                //         {this.candidates}
                //     </Dropdown.Menu>
                // </Dropdown>
                }
                
                
                <Form.Group className='flex-grow-1 col-xs-1'>
                    
                    <Form.Control type='text' style={style.input} className='border pl-3 w-100 m-0 p-0' value={value} onChange={this.handleChange}style={{borderRadius: '20px'}}></Form.Control>
                </Form.Group>
                
                
                <Button type="submit" variant='link' className="btn btn-link btn-sm text-uppercase bd-highlight m-0 p-0" onClick={this.handleSubmit}><img src={searchIcon} className="submitIcon" width="30px" /></Button>
            </Form>
        );
    }
}

Searchbar.contextType = LocaleContext;
export default Searchbar;