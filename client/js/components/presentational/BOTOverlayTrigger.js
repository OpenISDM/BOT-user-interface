import React from 'react'
import PropTypes from 'prop-types'
import { Popover, OverlayTrigger } from 'react-bootstrap'

const BOTOverlayTrigger = ({
	popoverTitle,
	popoverBody,
	id,
	placement,
	trigger,
	innerElement = <></>,
}) => {
	return (
		<OverlayTrigger
			trigger={trigger}
			key={id}
			placement={placement}
			overlay={
				<Popover id={`popover-positioned-${placement}`}>
					<Popover.Content className="popover-content">
						{popoverBody}
					</Popover.Content>
					<Popover.Title as="h3">{popoverTitle}</Popover.Title>
				</Popover>
			}
		>
			{innerElement}
		</OverlayTrigger>
	)
}

BOTOverlayTrigger.propTypes = {
	popoverTitle: PropTypes.string.isRequired,
	popoverBody: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	trigger: PropTypes.string.isRequired,
	placement: PropTypes.string.isRequired,
	innerElement: PropTypes.element,
}

export default BOTOverlayTrigger
