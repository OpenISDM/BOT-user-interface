import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button}  from 'react-bootstrap';




import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';


var QRCode = require('qrcode.react');


// need Inputs : search Result
// this component will send json to back end, backend will return a url, and the component generate a qrcode
class PdfDownloadForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            savePath: "",
            data: null,
            alreadyUpdate: false,
            hasData: false
        };

        this.handleClose = this.handleClose.bind(this)
        this.PdfDownloader = this.PdfDownloader.bind(this)
    
    }
    componentDidMount(){
        

    }
    componentDidUpdate (){
        if(this.props.show && !this.state.alreadyUpdate){
            // console.log(this.props.data)
            if(this.props.data.length!=0){
                axios.post('http://localhost:3000/data/QRCOde',this.props.data).then(res => {
                    this.setState({
                        savePath : res.data,
                        data: this.props.data,
                        alreadyUpdate: true,
                        show:true,
                        hasData: true
                    })  
                })
            }else{
                this.setState({
                    alreadyUpdate: true,
                    show:true,
                    hasData: false
                })  
                
            }   
        } 
    }
    handleClose() {
        // console.log('hi')
        this.props.handleClose()
        this.setState({
            show: false,
            alreadyUpdate:false,
        })

    }
    PdfDownloader(){
       
    window.open(this.state.savePath);
    }

  
    render() {

        const {hasData, show, savePath} = this.state
        

        return (
            <div>  
                <Modal show={this.state.show} onHide={this.handleClose} size="lg" >
                    <Modal.Header closeButton>Print Search Result 
                    </Modal.Header >
                    <Modal.Body>

                            <div  style = {{width: '66%', float: 'left'}}>
                                {hasData
                                    ?<QRCode
                                        value={savePath} 
                                        size={256}
                                    />
                                    :<h3>No Searh Results</h3>
                                }
                            </div>
                            <div style = {{margin: '0px', width: '33%', float: 'right'}}>
                                {hasData

                                    ?<Button onClick={this.PdfDownloader}>Button</Button>
                                    :<h3>No Searh Results</h3>
                                }
                            </div>


                        
                    </Modal.Body>
                    <Modal.Footer>
                        
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

Modal.contextType = LocaleContext;
  
export default PdfDownloadForm;
 