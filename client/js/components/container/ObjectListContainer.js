import React from 'react'
import ObjectListMenu from '../presentational/ObjectListMenu'

class ObjectListContainer extends React.Component {
	render() {
		return (
			<ObjectListMenu
				isOpen={true}
				menuOption={this.props.menuOption}
				objectList={this.props.objectList}
			/>
		)
	}
}

export default ObjectListContainer
