import React from 'react';
import LocaleContext from '../../context/LocaleContext';
import searchIcon from '../../../img/search.png';
import { Form, Row, Col, Button } from 'react-bootstrap';
import  '../../../css/Searchbar.css';

class Searchbar extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
            <Form className="d-flex justify-content-center col-xs-8" style={style.form}>
                {/* <div className="form-group mx-3">
                    <label htmlFor="inputPassword2" className="sr-only">{locale.search.toUpperCase()}</label>
                    <input type="text" className="form-control-sm border-0" value={value} onChange={this.handleChange}/>
                </div> */}
                <Form.Group className='flex-grow-1 col-xs-1'>
                    <Form.Control type='text' style={style.input} className='border-0 pl-3 w-100 m-0 p-0' value={value} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button type="submit" variant='link' className="btn btn-link btn-sm text-uppercase bd-highlight m-0 p-0" onClick={this.handleSubmit}><img src={searchIcon} className="submitIcon" width="30px" /></Button>
            </Form>
        );
    }
}

Searchbar.contextType = LocaleContext;
export default Searchbar;