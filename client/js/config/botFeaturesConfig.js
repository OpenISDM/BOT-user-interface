import { convertConfigValue } from '../helper/utilities'

const botFeaturesConfig = {
	GENERATE_SHIFT_RECORD_ENABLE_DOUBLE_CONFIRMED:
		process.env.GENERATE_SHIFT_RECORD_ENABLE_DOUBLE_CONFIRMED || false,
}

export default convertConfigValue(JSON.stringify(botFeaturesConfig))
