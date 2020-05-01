import React from 'react'
import {
    Container
} from 'react-bootstrap'
import config from '../../config'

const About = () => {

    return (
        <Container fluid className="mt-5">
            Build 
            &nbsp;
            {config.VERSION}
        </Container>
    )
    
}

export default About