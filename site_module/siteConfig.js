/**
 * Area modules for specific site.
 * Follow the steps below to create your area modules.
 *
 * 1. Place your area map image in the folder named map located in /site_module/img.
 * 2. Import the area map image from the folder. The image name should include extension.
 * 3. Set the modules as the example below.
 */

import IIS_SINICA_FOURTH_FLOORTH_MAP from '../site_module/img/map/iis_new_building_fourth_floor.png'
import IIS_SINICA_FOURTH_FLOORTH_MAP_WEBP from '../site_module/img/map/iis_new_building_fourth_floor.webp'
import NTUH_YUNLIN_WARD_FIVE_B_MAP from '../site_module/img/map/ntuh_yunlin_branch_ward_five_b.png'
import NTUH_YUNLIN_WARD_FIVE_B_MAP_WEBP from '../site_module/img/map/ntuh_yunlin_branch_ward_five_b.webp'
import NURSING_HOME_MAP from '../site_module/img/map/nursing_home.png'
import NURSING_HOME_MAP_WEBP from '../site_module/img/map/nursing_home.webp'
import HEALTH_CARE_MAP from '../site_module/img/map/HEALTH_CARE.png'
// import HEALTH_CARE_MAP_WEBP from '../site_module/img/map/HEALTH_CARE.webp'

const siteConfig = {
	areaModules: {
		/** The key must be as same as the field name in area_table in database */
		IIS_SINICA_FOURTH_FLOOR: {
			/** The id would be the field id in area_table */
			id: 2,

			/** The name would be the field name in area_table  */
			name: 'IIS_SINICA_FOURTH_FLOOR',

			/** Flag the area if there is map image of this area in the map folder
			 *  Set false if the mag image is not ready
			 */
			hasMap: false,

			/** The source of the area map. It can put NULL if the map image is not ready */
			url: IIS_SINICA_FOURTH_FLOORTH_MAP,

			urlWebp: IIS_SINICA_FOURTH_FLOORTH_MAP_WEBP,

			/** The relative value of latitude and longitude of the area
			 *  The elements would be the points of left-bottom and right-upper, respectively. */
			bounds: [
				[0, 0],
				[21130, 35710],
			],
		},
		HEALTH_CARE: {
			id: 4,
			name: 'HEALTH_CARE',
			hasMap: 1,
			url: HEALTH_CARE_MAP,
			// urlWebp: HEALTH_CARE_MAP_WEBP,
			bounds: [
				[1081, 2702],
				[5555, 13513],
				// [1000, 3920], // 0.00000900900901
			],
		},
	},
}

export default siteConfig
