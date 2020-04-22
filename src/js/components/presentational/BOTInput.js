import React from 'react';
import { Form, Button } from 'react-bootstrap';

class BOTInput extends React.Component {
    
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

    handleChange = (e) => { 
        this.setState({
            value: e.target.value
        })  
        this.props.getSearchKey(e.target.value);
    }

    render() {

        const { value } = this.state;
        const {
            placeholder,
            error,
            example,
            name
        } = this.props

        let style = {
            
            error: {
                color: "#dc3545"
            },
            example: {
                color: "grey"

            }
        }
        return (            
            <Form>
                <div className="d-flex">
                    <Form.Group 
                        className='d-flex align-items-center'
                        style={{
                            border: '1px solid #ced4da',
                            // border: 'none',
                            height: '3rem',
                            padding: '.275rem .75rem',
                            background: 'white',
                            width: 300,
                        }}
                    >
                        <i 
                            className="fas fa-search"
                            style={{
                                color: 'black'
                            }}
                        />
                        <Form.Control 
                            type='text' 
                            name={name}
                            value={value} 
                            onChange={this.handleChange}
                            placeholder={placeholder}
                            style={{
                                border: 'none',
                                background: 'unset',
                                letterSpacing: '1.5px',
                                color: 'grey'
                            }}
                        />
                    </Form.Group>
                </div>
                {example && 
                    <small 
                        className="form-text"
                        style={style.example}
                    >
                        {example}
                    </small>
                }
                {error &&  
                    <small 
                        className="form-text text-capitaliz"
                        style={style.error}
                    >
                        {error}
                    </small>
                }
            </Form>
        );
    }
}

export default BOTInput;