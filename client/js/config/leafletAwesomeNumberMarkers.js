/*global L*/

;(function () {
	'use strict'
	L.AwesomeNumberMarkers = L.Icon.extend({
		options: {
			iconSize: [50, 50], // [35, 45]
			iconAnchor: [25, 25], // [17, 42]
			popupAnchor: [0, -40], // [1, -32]
			className: 'awesome-number-marker',
			icon: 'home',
			markerColor: 'blue',
			numberColor: 'black',
			number: '',
			numberSize: 20,
			numberShiftTop: '2%',
			numberShiftLeft: '2%',
		},

		createIcon() {
			const div = document.createElement('div'),
				options = this.options

			div.innerHTML = this._createInner()
			this._setIconStyles(div, 'icon-' + options.markerColor)

			return div
		},

		_createInner() {
			let iconColorStyle = ''
			const options = this.options
			let numberShiftTop = ''

			if (options.numberColor) {
				iconColorStyle =
					'color: ' +
					options.numberColor +
					'; font-size: ' +
					options.numberSize +
					'px' +
					";' "
			}

			numberShiftTop = 'top: ' + options.numberShiftTop + ';'

			const numberPosition = 'position: relative;'
			const numberShiftLeft = 'left: ' + options.numberShiftLeft + ';'

			return (
				"<i style='" +
				numberPosition +
				numberShiftTop +
				numberShiftLeft +
				iconColorStyle +
				"><strong className='font-weight-bold'>" +
				options.number +
				'</strong></i>'
			)
		},

		_setIconStyles(img, name) {
			const options = this.options,
				size = L.point(options.iconSize),
				anchor = L.point(options.iconAnchor)

			img.className = 'awesome-number-marker-' + name + ' ' + options.className

			if (anchor) {
				img.style.marginLeft = -anchor.x + 'px'
				img.style.marginTop = -anchor.y + 'px'
			}

			if (size) {
				img.style.width = size.x + 'px'
				img.style.height = size.y + 'px'
			}
		},
	})
})()
