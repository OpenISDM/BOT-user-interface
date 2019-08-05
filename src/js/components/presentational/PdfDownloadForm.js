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
            hasData: false,
            isDone: false,
        };

        this.handleClose = this.handleClose.bind(this)
        this.PdfDownloader = this.PdfDownloader.bind(this)
    
    }
    componentDidMount(){
        

    }
    shouldComponentUpdate(nextProps, nextState) {

        if(nextProps.show || nextState.show){
            return true;
        }else{
            return true;
        }
    }
    componentDidUpdate (preProps){
        // console.log(this.state.show)
        if(this.props.show && !this.state.show){
            axios.post(dataSrc.QRCode,this.props.data).then(res => {
                this.setState({
                    savePath : res.data,
                    data: this.props.data,
                    show: this.props.show,
                    alreadyUpdate: true,
                    isDone: true,
                    hasData: true
                })  
            })
            
        }
    }
    handleClose() {
        
        this.props.handleClose()
        this.setState({
            show: false,
            alreadyUpdate:false,
            isDone: false,
        })


    }
    PdfDownloader(){
       
        window.open(this.state.savePath);
    }

  
    render() {

        const {hasData, show, savePath, isDone} = this.state
        

        return (
            <div>  
                <Modal show={this.state.show}  onHide={this.handleClose} size="lg" >
                    <Modal.Header closeButton>Print Search Result 
                    </Modal.Header >
                    <Modal.Body>


                                <div  style = {{width: '66%', float: 'left'}}>

                                    {hasData 
                                        ?<QRCode
                                            value={dataSrc.pdfUrl(savePath)} 
                                            size={256}
                                        />
                                        : hasData 
                                            ? <h3>Wait for a moment</h3>
                                            : <h3>No Searh Results</h3>
                                    }
                                </div>
                                <div style = {{margin: '0px', width: '33%', float: 'right'}}>
                                    {hasData && isDone

                                        ?<Button onClick={this.PdfDownloader}>Button</Button>
                                        : hasData 
                                            ? <h3>Wait for a moment</h3>
                                            : <h3>No Searh Results</h3>
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
 