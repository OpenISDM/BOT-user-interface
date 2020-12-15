/*
    2020 © Copyright (c) BiDaE Technology Inc.
    Provided under BiDaE SHAREWARE LICENSE-1.0 in the LICENSE.

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        ms-MY.js

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

const ms = {
	ABBR: 'ms-MY',

	BEDI_TECH: 'BiDaE Technology, Incorporated',
	SLOGAN: 'Objek Penjejak BiDaE',

	HOME: 'rumah',
	HEALTH_REPORT: 'laporan kesihatan',
	DEVICE_MONITOR: 'monitor peranti',
	SYSTEM_SETTING: 'tetapan sistem',
	BOT_ADMIN: 'BOT admin',
	CONTACT_TREE: 'pokok kenalan',
	MONITOR_MANAGEMENT: 'pengurusan monitor',
	GEOFENCE: 'geofence',
	OBJECT_MANAGEMENT: 'pengurusan objek',
	MANAGEMENT: 'pengurusan',
	BIG_SCREEN: 'skrin besar',
	ABOUT: 'about',
	TRACKING_HISTORY: 'sejarah penjejakan',
	TRACKING_PATH: 'laluan penjejakan',
	TRACKING_RECORD: 'rekod penjejakan',
	TRACE: 'jejak',
	HISTORICAL_TRACKING_RECORD: 'rekod penjejakan sejarah',
	REAL_TIME_TRACKING_RECORD: 'rekod penjejakan masa nyata',
	HISTORICAL_RECORD: 'catatan sejarah',
	REAL_TIME_RECORD: 'rekod masa nyata',
	TRACKING_TABLE: 'jadual penjejakan',
	SETTINGS: 'tetapan',
	CUSTOM_SETTINGS: 'Tetapan tersuai',
	SEARCH_SETTINGS: 'Search settings',
	NOTIFICATION_SETTINGS: 'Notification settings',
	REQUEST_ASSET_USAGE_DATA: 'Catat data penggunaan aset',
	REPORT_OF_HISTORICAL_NOTIFICATIONS: 'Report Of Historical Notifications',
	REPORT_AND_CHANGE_NOTES_ON_PATIENTS: 'Hasilkan dan lihat nota pada pesakit',
	REPORT_OF_HISTORICAL_DEVICE_STATUS_CHANGED_RECORDS:
		'Report of historical device status changed records',
	GENERATE_AND_VIEW_SHIFT_CHANGE_RECORD:
		'Hasilkan dan lihat rekod perubahan shift',
	DEVICE_SERVICE_REQUEST: 'Minta perkhidmatan pembaikan peranti',
	REQUEST_OBJECT_TRACE: 'Minta jejak objek',
	SHIFT_CHANGE: 'shift shift',
	MONITOR_SETTINGS: 'tetapan monitor',
	REPORT: 'Sokongan Operasi',
	RECORD: 'Sokongan Operasi',
	LBEACON: 'lbeacon',
	GATEWAY: 'pintu masuk',
	SEARCH_RESULT: 'hasil carian',
	NO_RESULT: 'tanpa hasil',
	RESULTS: 'hasil',
	FREQUENT_SEARCH: 'carian kerap',
	FOUND: 'dijumpai',
	NOT_FOUND: 'tidak dijumpai',
	OBJECT_TYPE: 'jenis objek',
	OBJECT: 'objek',
	TYPES: 'jenis',
	disable: 'lumpuhkan',
	count: 'rekod',
	LAST_KNOWN_LOCATION: 'Lokasi terakhir diketahui',
	MOVING: 'Bergerak',
	STATIONARY: 'Tidak bergerak',
	POSITION: 'KEDUDUKAN',
	POSITION_UNDEFINE: 'Pilih status kedudukan',
	ROOM_NUMBER: 'Nombor Bilik',
	PATIENT_NUMBER: 'Nombor Pesakit',
	ATTENDING_PHYSICIAN: 'doktor yang menghadiri',
	BATTERY_ALERT: 'amaran penggantian bateri',
	PICTURE: 'Gambar',
	BATTERY_CHANGE: 'perlukan perubahan',
	DEVICE_TABLE: 'Add/Delete Devices',
	PATIENT_TABLE: 'Add/Delete Patients',
	STAFF_TABLE: 'Add/Delete Employees And Contractors',
	VISTOR_TABLE: 'Add/Delete Visitors And Others',
	BATTERY_TABLE: 'Show Battery Status',
	TAGS: 'tag',
	PATIENT_GENDER: 'Jantina',
	CHOOSE_GENDER: 'Pilih jantina',
	PATIENT: 'sabar',
	SCAN_TAG: 'Sila Imbas TAG',
	ALREADY_CHOOSE: 'Sudah memilih',
	MAIN_AREA: 'Kawasan utama',
	PRIMARY_AREA: 'kawasan utama',
	SECONDARY_AREAS: 'kawasan sekunder',
	PERSONA_LIST: 'senarai persona',
	IMPORT_PERSONA: 'import persona',
	GET_ASSIGNMENTS: 'Get Assignments',
	REPORT_AND_CHANGE_DEVICE_STATUS: 'Report And Change Device Status',

	/* Location accuracy */
	LOCATION_ACCURACY: 'Ketepatan Lokasi',
	LOW: 'rendah',
	MED: 'med',
	HIGH: 'tinggi',

	/* List title */
	ALL_DEVICES: 'Semua peranti',
	ALL_PATIENTS: 'Semua pesakit',
	MY_DEVICES: 'Peranti saya',
	MY_PATIENTS: 'Pesakit saya',
	OBJECTS: 'objek',
	ITEM: 'item',
	DEVICES_FOUND: 'peranti dijumpai',
	PATIENTS_FOUND: 'pesakit dijumpai',
	DEVICES_NOT_FOUND: 'peranti tidak dijumpai',
	PATIENTS_NOT_FOUND: 'pesakit tidak dijumpai',
	SEARCH_RESULTS_FOUND: 'hasil carian ditemui',
	OBJECTS_FOUND: 'objek dijumpai',
	OBJECTS_NOT_FOUND: 'objek tidak dijumpai',
	SEARCH_RESULTS_NOT_FOUND: 'hasil carian tidak dijumpai',
	PLEASE_SELECT_SEARCH_OBJECT: 'sila pilih objek carian',
	BIND_MAC_ADDRESS: 'Masukkan mac_address untuk mengikat',
	IMPORT_DEVICES_DATA: 'Data HIS',
	IMPORT_PATIENTS_DATA: 'Pesakitnya',
	BATTERY_NOTIFICATION: 'pemberitahuan bateri',
	ABOUT_YOU: 'mengenai anda',
	YOUR_SERVICE_AREAS: 'kawasan perkhidmatan anda',
	PREFERENCE: 'keutamaan',
	SEARCH_PREFERENCES: 'pilihan carian',
	MALE: 'lelaki',
	FEMALE: 'perempuan',
	EDIT_ALIAS: 'edit alias',
	EDIT_DEVICE_ALIASES: 'edit alias peranti',

	/* buttons */
	CLEAR: 'jelas',
	SAVE: 'simpan',
	EDIT_SECONDARY_AREA: 'edit kawasan sekunder',
	EDIT_PASSWORD: 'edit kata laluan',
	CANCEL: 'batal',
	DISCARD: 'discard',
	SEND: 'hantar',
	SIGN_IN: 'log masuk',
	SIGN_UP: 'daftar',
	SIGN_OUT: 'log keluar',
	LOG_IN: 'log masuk',
	LOG_OUT: 'log keluar',
	ON: 'on',
	OFF: 'mati',
	SHIFT_CHANGE_RECORD: 'rekod perubahan peralihan',
	SHOW_DEVICES: 'tunjukkan peranti',
	HIDE_DEVICES: 'sembunyikan peranti',
	SHOW: 'tunjukkan',
	DEVICE: 'peranti',
	DEVICES: 'peranti',
	DOWNLOAD: 'muat turun',
	DELETE: 'delete',
	DELETE_LBEACON: 'delete LBeacon',
	DELETE_GATEWAY: 'delete Gateway',
	ADD_USER: 'tambah pengguna',
	ADD_INPATIENT: 'tambah pesakit dalam',
	DELETE_INPATIENT: 'hapus pesakit dalam',
	DELETE_DEVICE: 'padam peranti',
	EDIT_DEVICES: 'edit peranti',
	SWITCH_AREA: 'tukar kawasan',
	FENCE_ON: 'pagar di atas',
	FENCE_OFF: 'pagar mati',
	LOCATION_MONITOR_ON: 'loc. Monitor on',
	LOCATION_MONITOR_OFF: 'loc. Monitor off',
	CLEAR_ALERTS: 'amaran yang jelas',
	SHOW_RESIDENTS: 'tunjukkan penduduk',
	HIDE_RESIDENTS: 'sembunyikan penduduk',
	VIEW_REPORT: 'lihat laporan',
	VIEW: 'lihat',
	DOWNLOAD_REPORT: 'muat turun laporan',
	CLOSE: 'tutup',
	SHOW_DEVICES_NOT_FOUND: 'tunjukkan peranti tidak dijumpai',
	SHOW_DEVICES_FOUND: 'tunjukkan peranti yang dijumpai',
	SHOW_PATIENTS_NOT_FOUND: 'tunjukkan pesakit tidak dijumpai',
	SHOW_PATIENTS_FOUND: 'tunjukkan pesakit dijumpai',
	SHOW_SEARCH_RESULTS_FOUND: 'tunjukkan hasil carian dijumpai',
	SHOW_SEARCH_RESULTS_NOT_FOUND: 'tunjukkan hasil carian tidak dijumpai',
	ASSOCIATE: 'bersekutu',
	DISSOCIATE: 'memisahkan',
	BIND: 'ikat',
	UNBIND: 'terikat',
	IMPORT_OBJECT: 'Import Excel',
	ACN_VERIFICATION: 'Pengesahan ACN',
	BINDING_SETTING: 'Pengaturan Mengikat',
	BINDING_DELETE: 'Binding Delete',
	DELETE_OPTION: 'Padam pilihan',
	HIDE_PATH: 'jalan sembunyi',
	RETURN: 'Kembali',
	ADD_RULE: 'tambah peraturan',
	ADD: 'Tambah',
	REMOVE: 'Alih keluar',
	DELETE_USER: 'Padam pengguna',
	MULTIPLEDELETE: 'multiple delete',
	SHOW_MAP: 'tunjukkan peta',
	HIDE_MAP: 'sembunyikan peta',
	NEW_SEARCH: 'carian baru',
	SEARCH: 'cari',
	ADD_BRANCH: 'Tambah cawangan',
	FORM: 'Borang',
	ROUTE: 'Laluan',
	USER: 'Pengguna',
	ADD_PERMISSION: 'tambahkan Kebenaran',
	EXPORT: 'eksport',
	EXPORT_CSV: 'eksport CSV',
	EXPORT_PDF: 'eksport PDF',
	REQUEST_EMAIL_INSTRUCTION:
		'Masukkan alamat e-mel yang anda gunakan semasa anda bergabung dan kami akan mengirimkan arahan untuk menetapkan semula kata laluan anda.',
	SEND_RESET_INSTRUCTION: 'Minta tetapkan semula kata laluan',
	DETAIL: 'detail',
	NON_BINDING: 'Tag belum terikat',
	GENERATE_RECORD: 'menjana rekod',
	CREATE_LOCATION: 'tambahkan lokasi yang dipindahkan',

	/* field */
	NAME: 'nama',
	EMAIL: 'alamat e-mel',
	PATIENT_NAME: 'nama pesakit',
	KEY: 'kunci',
	TYPE: 'type',
	ASSET_CONTROL_NUMBER: 'ID Aset',
	OBJECT_IDENTITY_NUMBER: 'ID objek',
	MAC_ADDRESS: 'alamat mac',
	STATUS: 'status',
	MONITOR_TYPE: 'jenis monitor',
	ACN: 'ACN',
	LOCATION: 'lokasi',
	PATIENT_HISTORICAL_RECORD: 'catatan sejarah',
	RSSI_THRESHOLD: 'ambang RSSI',
	LAST_FOUR_DIGITS_IN_ACN: '4 digit terakhir dalam ACN',
	ADD_DEVICE: 'tambah peranti',
	ADD_PATIENT: 'tambah pesakit',
	DELETE_PATIENT: 'hapus pesakit',
	ADD_NOTE: 'tambah nota',
	HIDE_NOTE: 'sembunyikan nota',
	DELAY_BY: 'kelewatan oleh',
	SHIFT: 'shift',
	DAY_SHIFT: 'shift sehari',
	SWING_SHIFT: 'swing shift',
	NIGHT_SHIFT: 'shift malam',
	SELECT_SHIFT: 'pilih shift',
	SELECT_AREA: 'pilih kawasan',
	SELECT_USER: 'pilih pengguna',
	SELECT_LOCATION: 'pilih lokasi',
	SELECT_PHYSICIAN: 'pilih doktor',
	SELECT_ROOM: 'pilih bilik',
	SELECT_LBEACON: 'pilih lbeacon',
	SELECT_TIME: 'pilih masa',
	SELECT_TYPE: 'pilih jenis',
	SELECT_STATUS: 'pilih status',
	SELECT_MONITOR_TYPE: 'pilih jenis monitor',
	TYPE_SEARCH_KEYWORD: 'taipkan kata kunci carian ...',
	WRITE_THE_NOTES: 'nota',
	USERNAME: 'nama pengguna',
	PASSWORD: 'kata laluan',
	DATE_TIME: 'tarikh / masa',
	DEVICE_LOCATION_STATUS_CHECKED_BY: 'lokasi / status peranti diperiksa oleh',
	AUTH_AREA: 'kawasan autentikasi',
	RECEIVER_ID: 'ID penerima',
	RECEIVER_NAME: 'nama penerima',
	RECEIVER_SIGNATURE: 'tandatangan penerima',
	ENABLE: 'aktifkan',
	DISABLE: 'lumpuhkan',
	ENABLE_START_TIME: 'masa mula',
	ENABLE_END_TIME: 'masa tamat',
	START_TIME: 'masa mula',
	END_TIME: 'waktu tamat',
	BINDFLAG: 'Status Mengikat',
	PERIMETERS_GROUP: 'kumpulan perimeter',
	FENCE_RSSI: 'pagar rssi',
	PERIMETER_RSSI: 'perimeter rssi',
	DEPARTMENT: 'jabatan',
	NEW_DEPARTMENT: 'jabatan baru',
	FENCES_GROUP: 'kumpulan pagar',
	RSSI: 'rssi',
	YES: 'ya',
	NO: 'tidak',
	IS_GLOBAL_FENCE: 'pagar global',
	SIGNATURE: 'tandatangan',
	NUMBER_OF_SEARCH_HISTORY: 'bilangan sejarah carian',
	NUMBER_OF_FREQUENT_SEARCH: 'bilangan carian yang kerap',
	SEARCH_TYPE: 'jenis carian objek',
	SELECTED_AREAS: 'kawasan terpilih',
	NOT_SELECTED_AREAS: 'bukan kawasan yang dipilih',
	LOCATION_SELECTION: 'lokasi',
	RECORDED_BY: 'dirakam oleh',
	ADD_NEW_RECORD: 'tambah rekod baru',
	FOLD: 'lipat',
	COMMENT: 'komen',
	SELECT_LEVEL: 'pilih tahap',
	NICKNAME: 'nama panggilan',
	NUM_OF_UPDATED_LBEACON: '# lbeacons yang dikemas kini',
	FORGET_PASSWORD: 'lupa kata laluan?',
	RESET_PASSWORD: 'tetapkan semula kata laluan',

	/** form title */
	EDIT_LBEACON: 'edit lbeacon',
	ADD_OBJECT: 'tambah objek',
	DELETE_OBJECT: 'hapus objek',
	EDIT_OBJECT: 'edit objek',
	EDIT_PATIENT: 'edit pesakit',
	EDIT_INFO: 'edit maklumat',
	ADD_PERSONA: 'tambah persona',
	REPORT_DEVICE_STATUS: 'laporkan status peranti',
	DEVICE_STATUS: 'laporan status peranti',
	REPORT_PATIENT_STATUS: 'laporkan status pesakit',
	THANK_YOU_FOR_REPORTING: 'Terima kasih kerana melaporkan',
	PRINT_SEARCH_RESULT: 'hasil carian cetak',
	EDIT_USER: 'edit pengguna',
	REQUEST_FOR_DEVICE_REPARIE: 'Permintaan pembaikan peranti',
	DEVICE_TRANSFER_RECORD: 'Hasilkan rekod pemindahan peranti',
	BROKEN_DEVICE_LIST: 'senarai peranti rosak',
	TRANSFERRED_DEVICE_LIST: 'senarai peranti yang dipindahkan',
	WHOSE_DEVICES: 'peranti',
	TRANSFERRED_TO: 'dipindahkan ke',
	CHECKED_BY: 'diperiksa oleh',
	CONFIRMED_BY: 'disahkan oleh',
	MOVEMENT_MONITOR: 'monitor pergerakan',
	LONG_STAY_IN_DANGER_MONITOR: 'tinggal lama dalam bahaya',
	NOT_STAY_ROOM_MONITOR: 'jangan tinggal bilik',
	GEOFENCE_MONITOR: 'geofence',
	DISSOCIATION: 'pemisahan',
	ASSOCIATION: 'persatuan',
	EDIT_GEOFENCE_CONFIG: 'edit konfigurasi geofence',
	ADD_GEOFENCE_CONFIG: 'tambah konfigurasi geofence',
	WARNING: 'amaran',
	PROCESS_IS_COMPLETED: 'proses selesai',
	EDIT_MOVEMENT_MONITOR: 'edit monitor pergerakan',
	EDIT_LONG_STAY_IN_DANGER_MONITOR: 'edit lama tinggal di dangen monitor',
	EDIT_NOT_STAY_ROOM_MONITOR: 'edit jangan jaga monitor bilik',
	MOVEMENT: 'amaran pergerakan',
	PANIC: 'darurat',
	EDIT_SECONDARY_AREAS: 'edit kawasan sekunder',
	NEW_PASSWORD: 'Kata laluan baru',
	CHECK_PASSWORD: 'sahkan kata laluan baru',
	LEVEL: 'tahap',
	ADD_COMMENT: 'tambah komen',
	NAMEGROUPBYAREA: 'name (kumpulan kawasan)',
	NAMEGROUPBYUUID: 'nama (kumpulan UUID)',
	REMINDER: 'peringatan',

	/** error message */
	GENDER_IS_REQUIRED: 'Jantina diperlukan',
	ROLE_IS_REQUIRED: 'peranan diperlukan',
	NAME_IS_REQUIRED: 'Nama diperlukan',
	NUMBER_IS_REQUIRED: 'Nombor diperlukan',
	ROOMNUMBER_IS_REQUIRED: 'Nombor Bilik diperlukan',
	ATTENDING_IS_REQUIRED: 'Wajib menghadiri Doktor',
	TYPE_IS_REQUIRED: 'Jenis diperlukan',
	LOCATION_IS_REQUIRED: 'lokasi diperlukan',
	ASSET_CONTROL_NUMBER_IS_REQUIRED: 'ID aset diperlukan',
	MAC_ADDRESS_IS_REQUIRED: 'Alamat Mac diperlukan',
	STATUS_IS_REQUIRED: 'Status diperlukan',
	USERNAME_IS_REQUIRED: 'Nama pengguna diperlukan',
	PASSWORD_IS_REQUIRED: 'Kata laluan diperlukan',
	THE_Patient_Number_IS_ALREADY_USED: 'Nombor pesakit sudah digunakan',
	THE_ID_IS_ALREADY_USED: 'ID sudah digunakan',
	THE_USERNAME_IS_ALREADY_TAKEN: 'Nama pengguna sudah diambil',
	THE_ASSET_CONTROL_NUMBER_IS_ALREADY_USED: 'ID aset sudah digunakan',
	THE_MAC_ADDRESS_IS_ALREADY_USED: 'Alamat Mac sudah digunakan',
	INCORRECT_MAC_ADDRESS_FORMAT: 'format alamat mac tidak betul',
	THE_ATTENDINGPHYSICIAN_IS_WRONG: 'AttendingPhysician mesti nombor',
	AREA_IS_REQUIRED: 'Kawasan diperlukan',
	NOT_ASSIGNED_TO_ANY_DEVICES: 'Tidak ditugaskan ke mana-mana peranti',
	MAC_DO_NOT_MATCH: 'Alamat Mac tidak sepadan',
	THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT:
		'Alamat Mac sudah digunakan atau formatnya salah',
	MAC_ADDRESS_FORMAT_IS_NOT_CORRECT: 'format alamat mac tidak betul',
	TIME_FORMAT_IS_INCORRECT: 'format masa tidak betul',
	EMAIL_ADDRESS_FORMAT_IS_INCORRECT: 'format alamat e-mel tidak betul',
	LBEACON_FORMAT_IS_NOT_CORRECT: 'format alamat mac tidak betul',
	ASSET_CONTROL_NUMBER_IS_NOT_FOUND: 'nombor kawalan aset tidak dijumpai',
	INCORRECT: 'nama pengguna tidak betul',
	PASSWORD_INCORRECT: 'kata laluan salah',
	AUTHORITY_IS_NOT_ENOUGH: 'Kuasa tidak mencukupi',
	ACCOUNT_NOT_BELONG_THIS_AREA: 'Akaun ini bukan milik kawasan ini',
	START_TIME_IS_REQUIRED: 'Masa mula diperlukan',
	END_TIME_IS_REQUIRED: 'Masa tamat diperlukan',
	MUST_BE_NEGATIVE_NUMBER: 'mesti nombor negatif',
	CONNECT_TO_DATABASE_FAILED: 'sambungan ke pangkalan data gagal',
	THE_ASSET_CONTROL_NUMBER_IS_ALREADY_LINK: 'ini sudah dipaut',
	THE_ID_IS_ALREADY_ASSOCIATED: 'ID sudah dikaitkan',
	ENTER_THE_PASSWORD: 'masukkan kata laluan baru',
	PASSWORD_NOT_FIT: 'kata laluan tidak sesuai',
	ALEAST_CHOOSE_ONE_UUID: 'aleast pilih satu uuid',
	ENTER_THE_RSSI: 'Masukkan RSSI',
	REQUIRED: 'diperlukan',
	ID_IS_NOT_FOUND: 'ID tidak dijumpai',
	ASN_IS_REPEAT: 'asn adalah berulang',
	NOT_ALLOW_PUNCTUATION: 'data tidak membenarkan tanda baca',
	OVERLENGTH: 'hanya membenarkan di bawah 100 watak',
	LIMIT_IN_TWENTY_CHARACTER: 'Hadkan dalam 20 aksara',
	LIMIT_IN_FOURTY_CHARACTER: 'Hadkan dalam 40 aksara',
	ALEAST_ONE_DEPARTMENT: 'Aleast one department',
	CANNOT_WORK_NOW: 'tidak dapat berfungsi sekarang',

	/** placeholder */
	PLEASE_ENTER_OR_SCAN_MAC_ADDRESS: 'sila masukkan atau imbas alamat mac',
	PLEASE_ENTER_OR_SCAN_ASSET_CONTROL_NUMBER:
		'sila masukkan atau imbas nombor kawalan aset',
	TYPE_MAC_OR_NAME: 'taipkan alamat atau nama mac',
	ADD_A_COMMENT: 'Tambahkan komen ...',
	TYPING: 'menaip ...',
	WAIT_FOR_SEARCH: 'tunggu carian ...',
	NO_DATA_FOUND: 'tiada data dijumpai',
	SEARCH_FOR_NAME: 'Cari nama',
	SEARCH_FOR_UUID: 'Cari UUID',
	SEARCH_FOR_AREA: 'cari kawasan',
	SEARCH_FOR_NAMEGROUPBYAREA: 'cari nama',
	SEARCH_FOR_NAMEGROUPBYUUID: 'cari UUID',
	PLEASE_TYPE_PERSONA_ID: 'sila taip ID',
	PLEASE_TYPE_OBJECT_IDENTITY_NUMBER: 'sila taip ACN atau ID',

	/* Object Status */
	NORMAL: 'normal',
	BROKEN: 'pecah',
	TRANSFERRED: 'dipindahkan',
	RESERVE: 'terpelihara',
	RETURNED: 'dikembalikan',
	TRACED: 'dikesan',

	/** User Setting */
	USER_SETTING: 'Tetapan Pengguna',
	GENERATE_REVISE_DEVICE_ASSIGNMENTS: 'Penugasan peranti',
	GENERATE_REVISE_PATIENT_ASSIGNMENTS: 'Tugasan pesakit',
	USER_PROFILE: 'Profil Pengguna',
	ADD_DELETE_TRANSFER_LOCATIONS: 'Tambah / Padamkan Lokasi Pindahan',
	ROLE_PERMISSION_MANAGEMENT: 'kebenaran peranan',
	OBJECT_EDITED_RECORD: 'rekod yang diedit objek',
	PATIENT_RECORD: 'Catatan mengenai pesakit',
	PATIENT_HISTORIAL_RECORD: 'catatan sejarah',
	ACCESS_RIGHT: 'Akses Kanan',
	OTHER_DEVICES: 'Peranti Lain',
	ADD_DELETE_USER_ACCOUNTS: 'Tambah / Padam Akaun Pengguna',
	EDIT_USER_ROLES_AND_PERMISSIONS: 'Edit User Roles And Permissions',
	ADMIN: 'Pentadbir',
	CONFIRM: 'Sahkan',
	REMOVE_USER_CONFIRM: 'Buang Pengguna',

	/** table Title */
	MY_DEVICES_LIST: 'senarai peranti saya',
	MY_PATIENT_LIST: 'senarai pesakit saya',
	NOT_MY_DEVICES_LIST: 'bukan senarai peranti saya',
	NOT_MY_PATIENT_LIST: 'bukan senarai pesakit saya',

	/** table field */
	ID: 'ID',
	USER_ID: 'ID pengguna',
	HEALTH_STATUS: 'status',
	UUID: 'UUID',
	DESCRIPTION: 'penerangan',
	IP_ADDRESS: 'Alamat IP',
	GATEWAY_IP_ADDRESS: 'alamat IP pintu masuk',
	LAST_REPORT_TIMESTAMP: 'terakhir dilaporkan',
	LAST_REPORTED_TIMESTAMP: 'terakhir dilaporkan',
	LAST_REPORT_TIME: 'laporan terakhir',
	REGISTERED_TIMESTAMP: 'berdaftar',
	LAST_VISITED_TIMESTAMP: 'terakhir dikunjungi',
	HIGH_RSSI: 'RSSI tinggi',
	MED_RSSI: 'med RSSI',
	LOW_RSSI: 'RSSI rendah',
	NOTE: 'nota',
	BATTERY_VOLTAGE: 'voltan pemukul',
	BATTERY_INDICATOR: 'penunjuk adunan',
	REMAINING_BATTERY_VOLTAGE: 'baki voltan bateri',
	BATTERY: 'bateri',
	GEOFENCE_TYPE: 'jenis geofence',
	ALERT: 'amaran',
	TRANSFERRED_LOCATION: 'lokasi yang dipindahkan',
	LOCATION_DESCRIPTION: 'penerangan lokasi',
	LAST_LOCATION: 'lokasi terakhir',
	RESIDENCE_TIME: 'masa kediaman',
	RECEIVE_TIME: 'terima masa',
	ALERT_TIME: 'masa amaran',
	EDIT_TIME: 'diedit',
	SUBMIT_TIMESTAMP: 'dihantar',
	ROLES: 'jenis peranan',
	NOTES: 'nota',
	NO_DATA_AVAILABE: 'tidak ada data',
	NO_NOTIFICATION: 'tidak ada pemberitahuan',
	USER_NAME: 'nama pengguna',
	DEVICES_FOUND_IN: 'peranti dijumpai di',
	DEVICES_NOT_FOUND_IN: 'peranti tidak dijumpai di',
	CONFIRM_BY: 'sahkan oleh',
	NEW_STATUS: 'status baru',
	PHYSICIAN_NAME: 'nama doktor',
	DANGER_AREA: 'kawasan bahaya',
	ROOM: 'bilik',
	AREA: 'area',
	API_VERSION: 'versi api',
	SERVER_TIME_OFFSET: 'ofset masa pelayan',
	PRODUCT_VERSION: 'versi produk',
	ABNORMAL_LBEACON_LIST: 'senarai lbeacon tidak normal',
	ACTION: 'tindakan',
	BRANCH: 'cawangan',
	NEW_BRANCH: 'cawangan baru',
	ROLE_LIST: 'Senarai Peranan',
	PERMISSION_LIST: 'Daftar Kebenaran',
	ALIAS: 'alias',
	TYPE_ALIAS: 'alias',

	/** message */
	ARE_YOU_SURE_TO_DELETE: 'adakah anda pasti akan memadam?',
	ARE_YOU_SURE_TO_DISASSOCIATE: 'adakah anda pasti akan berpisah',
	NOW_YOU_CAN_DO_THE_FOllOWING_ACTION:
		'Sekarang anda boleh melakukan tindakan berikut',
	USERNAME_OR_PASSWORD_IS_INCORRECT:
		'Nama pengguna atau kata laluan tidak betul',
	PASSWORD_IS_INCORRECT: 'kata laluan tidak betul',
	PLEASE_ENTER_ID_AND_PASSWORD: 'sila masukkan maklumat Pentadbir',
	PLEASE_LOGIN_TO_CONFIRM: 'sila masukkan kata laluan',
	EDIT_LBEACON_SUCCESS: 'edit kejayaan lbeacon',
	EDIT_OBJECT_SUCCESS: 'edit kejayaan objek',
	DELETE_LBEACON_SUCCESS: 'hapus kejayaan lbeacon',
	DELETE_GATEWAY_SUCCESS: 'hapus kejayaan gateway',
	SAVE_SHIFT_CHANGE_SUCCESS: 'simpan kejayaan perubahan peralihan',
	SAVE_SUCCESS: 'selamatkan kejayaan',
	SELECT_ROLE: 'pilih peranan',
	SIGNUP_FAIL: 'nama pengguna ini sudah ada',
	PASSWORD_RESET_SUCCESSFUL: 'tetapan semula kata laluan berjaya',
	PASSWORD_RESET_INSTRUCTION_SUCCESSFUL:
		'arahan penetapan semula kata laluan telah dihantar ke e-mel anda. Ikuti arahan untuk menetapkan semula kata laluan.',

	/** user roles */
	CARE_PROVIDER: 'penyedia penjagaan',
	SYSTEM_ADMIN: 'BOT pentadbir',
	DEV: 'deverloper',

	TO: 'ke',
	SHIFT_TO: 'ke',
	NEAR: 'dekat',
	IS: 'adalah',
	WHEN: 'bila',
	NOT_AVAILABLE: 'T / A',
	IN: 'dalam',
	NOT: 'tidak',
	WHOSE: 's',
	BELONG_TO: 'kepunyaan',
	WAS: 'was',
	FROM: 'dari',
	MINUTES: 'minit',
	IS_RESERVED_FOR: 'dikhaskan untuk',
	POUND_SIGN: '#',

	// BEING_HERE: "berada di sini",

	/** locale */
	TW: 'cina',
	EN: 'Bahasa Inggeris',

	DEVICE_FOUND(length) {
		return length.toString() + 'peranti dijumpai'
	},
	DEVICE_NOT_FOUND(length) {
		return length.toString() + 'peranti tidak dijumpai'
	},

	genderSelect: ['mesin', 'lelaki', 'perempuan'],

	EDIT_DEVICE_GROUP_NAME: 'edit nama kumpulan',
	REMOVE_DEVICE_GROUP: 'hapus senarai',
	CREATE_DEVICE_GROUP: 'buat senarai peranti',
	CREATE_LIST: 'buat senarai',
	LIST_NAME: 'nama senarai',
	SELECT_DEVICE_LIST: 'pilih senarai peranti',
	RENAME: 'ganti nama',
	LICENCE: '© 2020 BiDaE Teknologi, Diperbadankan',
	SELECTED_DEVICES: 'Selected Devices',
	UNSELECTED_DEVICES: 'Unselected Devices',
	SELECTED_PATIENTS: 'Selected Patients',
	UNSELECTED_PATIENTS: 'Unselected Patients',
}

export default ms
