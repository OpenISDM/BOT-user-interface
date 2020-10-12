/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTPagination.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every
        LBeacon are retrieved from BeDIS (Building/environment Data and Information
        System) and stored locally during deployment and maintenance times. Once
        initialized, each LBeacon broadcasts its coordinates and location
        description to Bluetooth enabled user devices within its coverage area. It
        also scans Bluetooth low-energy devices that advertise to announced their
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

import React from 'react'
import PropTypes from 'prop-types'
import { AppContext } from '../../context/AppContext'

const defaultButton = (props) => <button {...props}>{props.children}</button>

export default class Pagination extends React.Component {
	static contextType = AppContext
	constructor(props) {
		super()

		this.changePage = this.changePage.bind(this)

		this.state = {
			visiblePages: this.getVisiblePages(null, props.pages),
		}
	}

	static propTypes = {
		pages: PropTypes.number,
		page: PropTypes.number,
		PageButtonComponent: PropTypes.any,
		onPageChange: PropTypes.func,
		previousText: PropTypes.string,
		nextText: PropTypes.string,
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.pages != this.props.pages) {
			this.setState({
				visiblePages: this.getVisiblePages(null, this.props.pages),
			})
		}
		this.changePage(this.props.page + 1)
	}

	filterPages = (visiblePages, totalPages) => {
		return visiblePages.filter((page) => page <= totalPages)
	}

	getVisiblePages = (page, total) => {
		if (total < 7) {
			return this.filterPages([1, 2, 3, 4, 5, 6], total)
		}
		if (page % 5 >= 0 && page > 4 && page + 2 < total) {
			return [1, page - 1, page, page + 1, total]
		} else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
			return [1, total - 3, total - 2, total - 1, total]
		}
		return [1, 2, 3, 4, 5, total]
	}

	changePage = (page) => {
		const activePage = this.props.page + 1

		if (page == activePage) {
			return
		}

		const visiblePages = this.getVisiblePages(page, this.props.pages)

		this.setState({
			visiblePages: this.filterPages(visiblePages, this.props.pages),
		})

		this.props.onPageChange(page - 1)
	}

	render() {
		const { PageButtonComponent = defaultButton } = this.props

		const { visiblePages } = this.state
		const activePage = this.props.page + 1

		const { locale } = this.context

		return (
			<div className="d-flex justify-content-between py-1">
				<div className="d-flex text-capitalize">
					<div className="font-weight-bold">{this.props.data.length}</div>
					&nbsp;
					{locale.texts.RESULTS}
				</div>
				{this.props.data.length != 0 && (
					<div className="d-flex">
						<div className="Table__prevPageWrapper">
							<PageButtonComponent
								className={
									'cursor-pointer outline-none border-none bg-transparent ' +
									(activePage == 1 ? 'cursor-not-allowed' : '')
								}
								onClick={() => {
									if (activePage == 1) return
									this.changePage(activePage - 1)
								}}
								disabled={activePage == 1}
							>
								{this.props.previousText}
							</PageButtonComponent>
						</div>

						<div className="Table__visiblePagesWrapper">
							{visiblePages.map((page, index, array) => {
								return (
									<PageButtonComponent
										key={page}
										className={
											'cursor-pointer outline-none border-none bg-transparent ' +
											(activePage == page ? 'color-blue font-weight-bold' : '')
										}
										onClick={this.changePage.bind(null, page)}
									>
										{array[index - 1] + 2 < page ? `...${page}` : page}
									</PageButtonComponent>
								)
							})}
						</div>

						<div className="Table__nextPageWrapper">
							<PageButtonComponent
								className={
									'cursor-pointer outline-none border-none bg-transparent ' +
									(activePage == this.props.pages ? 'cursor-not-allowed' : '')
								}
								onClick={() => {
									if (activePage == this.props.pages) return
									this.changePage(activePage + 1)
								}}
								disabled={activePage == this.props.pages}
							>
								{this.props.nextText}
							</PageButtonComponent>
						</div>
					</div>
				)}
			</div>
		)
	}
}
