import React from 'react'
import PropTypes from 'prop-types'
import { Popover, OverlayTrigger as RTBSOverlayTrigger } from 'react-bootstrap'

const OverlayTrigger = ({
	popoverTitle,
	popoverBody,
	id,
	placement,
	trigger,
	innerElement = <></>,
}) => {
	return (
		<RTBSOverlayTrigger
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
		</RTBSOverlayTrigger>
	)
}

OverlayTrigger.propTypes = {
	popoverTitle: PropTypes.string.isRequired,
	popoverBody: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	trigger: PropTypes.string.isRequired,
	placement: PropTypes.string.isRequired,
	innerElement: PropTypes.element,
}

export default OverlayTrigger
