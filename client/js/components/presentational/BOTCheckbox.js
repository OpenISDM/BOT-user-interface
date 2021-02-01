import React from 'react'

const BOTCheckbox = (props) => {
	return (
		<label className="container">
			<input
				type="checkbox"
				// aria-label={`${props.checked ? 'Un-select':'Select'} row with id:${props.id}` }
				checked={props.checked}
				id={props.id}
			/>
			<span
				className="checkmark"
				onClick={(e) => {
					const { shiftKey } = e
					e.stopPropagation()
					props.onClick(props.id, shiftKey, props.row)
				}}

				// id={props.id}
			></span>
		</label>
	)
}

export default BOTCheckbox
