import React from 'react'
import throttle from 'lodash/throttle'
import {
	Query,
	Builder,
	Utils as QbUtils,
	BasicConfig as basicConfig,
} from 'react-awesome-query-builder'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import PropTypes from 'prop-types'

import 'react-awesome-query-builder/lib/css/styles.css'
import 'react-awesome-query-builder/lib/css/compact_styles.css'

const queryValue = {
	id: QbUtils.uuid(),
	type: 'group',
}

export const BasicConfig = basicConfig

class QueryBuilder extends React.Component {
	immutableTree = null
	config = null
	onChangeCallback = () => {
		// do nothing
	}

	state = {
		config: null,
		tree: null,
	}

	componentDidMount = () => {
		const { fields, operators, jsonLogic, onChangeCallback } = this.props
		const config = { ...MaterialConfig, ...fields }

		config.settings = {
			...config.settings,
			showNot: false,
			// maxNesting: 1, // disable group function
		}

		config.operators = operators

		let tree = {}
		if (jsonLogic) {
			tree = QbUtils.checkTree(
				QbUtils.loadFromJsonLogic(jsonLogic, config),
				config
			)
		} else {
			tree = QbUtils.checkTree(QbUtils.loadTree(queryValue), config)
		}

		this.onChangeCallback = onChangeCallback

		this.setState({
			config,
			tree,
		})
	}

	render = () => {
		const { tree, config } = this.state
		return tree && config ? (
			<Query
				{...config}
				value={tree}
				onChange={this.onChange}
				renderBuilder={this.renderBuilder}
			/>
		) : null
	}

	renderBuilder = (props) => {
		return (
			// <div className="query-builder-container">
			<div className="query-builder qb-lite">
				<Builder {...props} />
			</div>
			// </div>
		)
	}

	onChange = (immutableTree, config) => {
		// Tip: for better performance you can apply `throttle` - see `examples/demo`
		this.immutableTree = immutableTree
		this.config = config
		this.updateResult()
	}

	updateResult = throttle(() => {
		this.setState({ tree: this.immutableTree, config: this.config })

		const { logic: jsonLogic } = QbUtils.jsonLogicFormat(
			this.immutableTree,
			this.config
		)
		const statement = QbUtils.sqlFormat(this.immutableTree, this.config)
		if (jsonLogic && statement) {
			this.onChangeCallback({ jsonLogic, statement })
		}
	}, 1000)
}

QueryBuilder.propTypes = {
	fields: PropTypes.object.isRequired,
	operators: PropTypes.object.isRequired,
	jsonLogic: PropTypes.object.isRequired,
	onChangeCallback: PropTypes.func,
}

export default QueryBuilder
