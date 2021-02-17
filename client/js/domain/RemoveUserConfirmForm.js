import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import PropTypes from 'prop-types'

class RemoveUserConfirm extends React.Component {
	constructor() {
		super()
		this.state = {
			userInfo: null,
			show: false,
		}
		this.staticParameter = {
			userRole: null,
		}
		this.API = {
			openUserInfo: (userInfo) => {
				this.state.userInfo = userInfo
				this.setState({})
			},
			closeUserInfo: () => {
				// this.staticParameter.userRole = null
				this.state.userInfo = null
				this.setState({})
			},
		}
		this.closeModifyUserInfo = this.closeModifyUserInfo.bind(this)
		this.submitModifyUserInfo = this.submitModifyUserInfo.bind(this)
	}

	closeModifyUserInfo() {
		this.props.onClose()
	}
	submitModifyUserInfo() {
		this.props.onSubmit()
	}

	render() {
		const { locale } = React.useContext(AppContext)

		return (
			<Modal show={this.props.show} onHide={this.closeModifyUserInfo}>
				<Modal.Header closeButton className="font-weight-bold">
					{locale.REMOVE_USER_CONFIRM}
				</Modal.Header>
				<Modal.Body className="d-block d-flex justify-content-center">
					<h2>{'Remove User ' + this.props.user}</h2>
				</Modal.Body>
				<Modal.Footer>
					<Button
						className="bg-light text-primary"
						onClick={this.closeModifyUserInfo}
					>
						Cancel
					</Button>
					<Button onClick={this.submitModifyUserInfo}>Submit</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

RemoveUserConfirm.propTypes = {
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
	user: PropTypes.object,
	show: PropTypes.bool,
}

export default RemoveUserConfirm
