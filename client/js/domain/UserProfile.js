import React from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { AppContext } from '../context/AppContext'
import EditPwdForm from './EditPwdForm'
import { setSuccessMessage } from '../helper/messageGenerator'
import config from '../config'
import NumberPicker from '../components/NumberPicker'
import API from '../api'
import Select from '../components/Select'
import { SAVE_SUCCESS } from '../config/wordMap'

class UserProfile extends React.Component {
	static contextType = AppContext

	state = {
		show: false,
		showEditPwd: false,
		areaTable: [],
	}

	componentDidMount = () => {
		this.getAreaTable()
	}

	/** get area table from database */
	getAreaTable = async () => {
		const { auth } = this.context
		const { user } = auth
		const res = await API.Area.getAreaTableByUserId({
			userId: user.id,
		})
		if (res) {
			const areaTable = res.data.areas
			this.setState({
				areaTable,
			})
		}
	}

	/** set user's number of search history */
	resetFreqSearchCount = async (value) => {
		const { auth } = this.context

		if (value) {
			const userInfo = auth.user
			userInfo.freqSearchCount = value
			this.setState({
				userInfo,
			})

			await API.User.editMaxSearchHistoryCount({
				info: userInfo,
				username: userInfo.name,
			})
			auth.setUserInfo('freqSearchCount', value)
		}
	}

	handleClick = (e) => {
		const name = e.target.name
		switch (name) {
			case 'password':
				this.setState({
					showEditPwd: true,
				})
				break
		}
	}

	handleClose = () => {
		this.setState({
			show: false,
			showEditPwd: false,
		})
	}

	handleSubmit = async (values) => {
		const { auth } = this.context
		const callback = () => setSuccessMessage(SAVE_SUCCESS)

		await API.User.password({
			user_id: auth.user.id,
			password: values.check_password,
		})

		this.setState(
			{
				show: false,
				showEditPwd: false,
			},
			callback
		)
	}

	render() {
		const { locale, auth } = this.context
		const { areaTable } = this.state

		let userKeywordType
		let defaultUserKeywordType

		const keywordTypeOptions = config.KEYWORD_TYPE.map((item, index) => {
			const option = {
				label: locale.texts[item.toUpperCase()],
				value: item,
				id: index,
			}

			if (item === 'type') {
				defaultUserKeywordType = option
			}

			if (parseInt(auth.user.keyword_type) === index) {
				userKeywordType = option
			}

			return option
		})

		if (!userKeywordType) {
			userKeywordType = defaultUserKeywordType
		}

		return (
			<div className="d-flex flex-column">
				<ButtonToolbar className="mb-2">
					<Button
						variant="outline-primary"
						className="text-capitalize mr-2"
						name="password"
						size="sm"
						onClick={this.handleClick}
					>
						{locale.texts.EDIT_PASSWORD}
					</Button>
				</ButtonToolbar>
				<div className="mb-3">
					<div className="font-size-120-percent color-black">
						{locale.texts.ABOUT_YOU}
					</div>
					<div>
						{locale.texts.NAME}: {auth.user.name}
					</div>
				</div>
				<div className="mb-3 text-capitalize">
					<div className="font-size-120-percent color-black">
						{locale.texts.SERVICE_AREAS}
					</div>
					<div>
						{Object.values(areaTable)
							.map((area) => {
								return area.readable_name
							})
							.join('/')}
					</div>
				</div>
				<div className="mb-3">
					<div className="font-size-120-percent color-black">
						{locale.texts.SEARCH_PREFERENCES}
					</div>
					<div className="py-2">
						<div className="mb-3">
							<div className="color-black mb-1">
								{locale.texts.NUMBER_OF_FREQUENT_SEARCH}
							</div>
							<NumberPicker
								name="numberPicker"
								value={auth.user.freqSearchCount}
								onChange={this.resetFreqSearchCount}
								length={10}
							/>
						</div>
						<div className="mb-3">
							<div className="color-black mb-1">{locale.texts.SEARCH_TYPE}</div>
							<Select
								value={userKeywordType}
								className="text-capitalize w-25"
								onChange={(value) => {
									auth.setKeywordType(value.id)
								}}
								options={keywordTypeOptions || []}
								isSearchable={false}
								styles={{
									control: (provided) => ({
										...provided,
										fontSize: '1rem',
										minHeight: '3rem',
										position: 'none',
										width: '160px',
										borderRadius: 0,
									}),
								}}
								components={{
									IndicatorSeparator: () => null,
								}}
								placeholder=""
							/>
						</div>
					</div>
				</div>
				<hr />
				<EditPwdForm
					show={this.state.showEditPwd}
					handleClose={this.handleClose}
					handleSubmit={this.handleSubmit}
				/>
			</div>
		)
	}
}

export default UserProfile
