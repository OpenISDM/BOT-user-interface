import React from "react";
import Surveillance from "../presentational/Surveillance";
import ToggleSwitch from "./ToggleSwitch";
import { 
    Nav, 
    Button,
    Image,
    Row,
    ButtonToolbar
}  from "react-bootstrap";
import LocaleContext from "../../context/LocaleContext";
import GridButton from "../container/GridButton";
import PdfDownloadForm from "./PdfDownloadForm"
import config from "../../config";
import AccessControl from "../presentational/AccessControl"
import { AppContext } from "../../context/AppContext";
import QRcodeContainer from "./QRcode";
import { isNullOrUndefined } from "util";
import InfoPrompt from '../presentational/InfoPrompt';

class SurveillanceContainer extends React.Component {

    static contextType = AppContext

    state = {
        rssi: config.defaultRSSIThreshold,
        selectedObjectData: [],
        showDevice: false,
        showPdfDownloadForm: false,
        area: this.props.area,
        data: this.props.data
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!(_.isEqual(prevProps.auth, this.props.auth))) {
            const [{ area }, dispatch] = this.context.stateReducer
            dispatch({
                type: "changeArea",
                value: this.props.auth.user.area
            })
            this.setState({
                area: this.props.auth.user.area
            })
        }
    }

    handleClickButton = (e) => {
        const [{ area }, dispatch] = this.context.stateReducer
        const { name } = e.target
        switch(name) {
            case "show devices":
                this.setState({
                    showDevice: !this.state.showDevice
                })
                break;
            case "clear":
                this.props.handleClearButton();
                break;
            case "save":
                this.setState({
                    showPdfDownloadForm: true,
                })
                break;
            case "IIS_SINICA_FLOOR_FOUR":
            case "NTUH_YUNLIN_WARD_FIVE_B":
                this.props.changeArea(name)
                dispatch({
                    type:'changeArea',
                    value: name
                })
                this.setState({
                    area: name
                })
                break;
        }

    }

    handleClosePdfForm = () => {
        this.setState({
            showPdfDownloadForm: false
        })
    }

    render(){
        const { 
            hasSearchKey,
            auth
        } = this.props;

        const style = {
            title: {
                color: "grey",
                fontSize: "1rem",
                maxWidth: "9rem",
                height: "5rem",
                lineHeight: "3rem"
            },
            // surveillanceContainer: {
            //     height: "100vh"
            // },
            MapAndQrcode: {
              //border: "solid"
            },
            qrBlock: {
                //border: "solid",
                flex: 1
            }, 
            mapBlock: {
                border: "solid 2px rgba(227, 222, 222, 0.619)",
                padding: "5px",
                flex: 3,
            },
            searchResult: {

            },
            gridButton: {
                display: this.state.showDevice ? null : "none"
            }
        }
        const { locale } = this.context;
        
        return(
            <div id="surveillanceContainer" className="w-100 h-100 d-flex flex-column" style={style.MapAndQrcode}>
                 <ButtonToolbar>
                    <Button 
                        variant="outline-primary" 
                        className="mr-1 text-capitalize" 
                        onClick={this.handleClickButton} 
                        name="IIS_SINICA_FLOOR_FOUR"
                        disabled={this.state.area === "IIS_SINICA_FLOOR_FOUR"}
                    >
                        {locale.texts.IIS_SINICA_FLOOR_FOUR}
                    </Button>
                
                    <Button 
                        variant="outline-primary" 
                        className="mr-1 text-capitalize" 
                        onClick={this.handleClickButton} 
                        name="NTUH_YUNLIN_WARD_FIVE_B"
                        disabled={this.state.area === "NTUH_YUNLIN_WARD_FIVE_B"}
                    >
                        {locale.texts.NTUH_YUNLIN_WARD_FIVE_B}
                    </Button>
                </ButtonToolbar>
                <div className="d-flex w-100 h-100 flex-column">
                    <div className="w-100 h-100 d-flex flex-row">
                        <div style={style.qrBlock}>
                            <QRcodeContainer 
                                show={true}
                                data={this.props.proccessedTrackingData.filter(item => item.searched)}
                                handleClose = {this.handleClosePdfForm}
                                userInfo={auth.user}
                            />
                            <InfoPrompt 
                            data={this.props.data}
                            title={locale.texts.FOUND} 
                            /> 
                        </div>
                        <div style={style.mapBlock}>
                            <Surveillance 
                                rssi={this.state.rssi} 
                                hasSearchKey={hasSearchKey}
                                colorPanel={this.props.colorPanel}
                                proccessedTrackingData={this.props.proccessedTrackingData}
                                getSearchKey={this.props.getSearchKey}
                                area={this.props.area}
                                auth={auth}
                            />
                        </div>
                    </div>
                </div>                
            </div>
        )
    }
}

export default SurveillanceContainer