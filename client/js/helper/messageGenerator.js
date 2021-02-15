import React from 'react'
import ToastMessage from '../domain/presentational/ToastMessage'
import { toast, Slide } from 'react-toastify'

export const setSuccessMessage = (msg) => {
	return toast.success(<ToastMessage msg={msg} />, {
		position: toast.POSITION.BOTTOM_CENTER,
		autoClose: 1500,
		className: 'color-black bg-green',
		bodyClassName: 'd-flex justify-content-center',
		hideProgressBar: true,
		closeButton: false,
		draggable: false,
		closeOnClick: true,
		transition: Slide,
	})
}

export const setErrorMessage = (
	msg = 'connect to database failed',
	autoClose = false
) => {
	return toast.success(<ToastMessage msg={msg} />, {
		position: toast.POSITION.TOP_CENTER,
		autoClose,
		className: 'color-red bg-pink',
		bodyClassName: 'd-flex justify-content-center',
		hideProgressBar: true,
		closeButton: false,
		draggable: false,
		closeOnClick: false,
		transition: Slide,
	})
}

export default {
	setSuccessMessage,
	setErrorMessage,
}
