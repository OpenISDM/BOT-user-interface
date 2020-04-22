import React from 'react';
import searchIcon from '../../../img/icon/search.png';
import { Form, Button } from 'react-bootstrap';
import {
    isMobileOnly
} from 'react-device-detect';

class BOTSearchbar extends React.Component {
    
    state = {
        value: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                value: '',
            })
        }
    }

    handleSubmit = (e) => { 
        e.preventDefault();
        this.props.getSearchKey(this.state.value);
        if (isMobileOnly) this.props.handleShowResultListForMobile();
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render() {

        const style = {
            form: {
                border: "2px solid rgba(227, 222, 222, 0.447)",
                borderRadius : '25px',
                fontSize: '0.8rem',
                width:300,
                minHeight: '1.2rem',
                position: 'relative'
            },
            input: {
                background: 'rgba(0,0,0,0)',
                fontSize: '1rem',
            }
        }

        const { value } = this.state;
        return (            
            <Form 
                style={style.form}
                className='d-flex justify-content-around'
            >
                <Form.Group 
                    className='d-flex justify-content-center align-items-center mb-0 mx-1'
                    style={{maxWidth: 250}}
                >
                    <i 
                        className="fas fa-search"
                        style={{
                            color: 'black',
                            fontSize: '1.2rem'
                        }}
                    />
                    <Form.Control 
                        id='BOTSearchbarText' 
                        type='text' 
                        style={style.input} 
                        className='border-0 w-100' 
                        value={value} 
                        onChange={this.handleChange}
                    />

                </Form.Group>
                <Button 
                    type="submit" 
                    variant='link' 
                    className="btn btn-link btn-sm bd-highlight"
                    style={{
                        width: 0,
                    }} 
                    onClick={this.handleSubmit}
                ></Button>
            </Form>
        );
    }
}



export default BOTSearchbar;