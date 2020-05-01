import React from 'react';
import { Form, Button } from 'react-bootstrap';

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
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render() {

        const style = {
            form: {
                border: '2px solid rgba(227, 222, 222, 0.447)',
                borderRadius : '25px',
                fontSize: '0.8rem',
                width: 250,
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
                    style={{minWidth: 200}}
                >
                    <i 
                        className='fas fa-search'
                        style={{
                            color: 'black',
                            fontSize: '1.2rem',
                            marginLeft: 10,
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
                    type='submit' 
                    variant='link' 
                    className='btn btn-link btn-sm bd-highlight'
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