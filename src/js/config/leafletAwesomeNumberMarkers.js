/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        leafletAwesomeNumberMarkers.js

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

/*
  Leaflet.AwesomeNumberMarkers, a plugin that adds number markers for Leaflet
  http://leafletjs.com
  https://github.com/zahidul-islam
*/

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

        createIcon: function () {
            var div = document.createElement('div'),
                options = this.options

            div.innerHTML = this._createInner()
            this._setIconStyles(div, 'icon-' + options.markerColor)

            return div
        },

        _createInner: function () {
            var iconColorStyle = ''
            var specifiedNumberTop = ''
            var options = this.options
            var numberShiftTop = ''

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

            if (options.markerColor == 'male') {
                numberShiftTop = 'top: ' + options.specifiedNumberTop + ';'
            }

            let numberPosition = 'position: relative;'
            let numberShiftLeft = 'left: ' + options.numberShiftLeft + ';'

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

        _setIconStyles: function (img, name) {
            var options = this.options,
                size = L.point(options['iconSize']),
                anchor = L.point(options.iconAnchor)

            img.className =
                'awesome-number-marker-' + name + ' ' + options.className

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
