import { put, del, get } from './utils/request'

const settingMode = {
    agent : '/data/agent',
    gateway : '/data/gateway',
    lbeacon : '/data/lbeacon'
}

export default {
    async put({formOption, mode}){
        return await put(settingMode[mode], {
            formOption,
        })
    },

    async delete({ids, mode}){
        return await del(settingMode[mode],{
            ids,
        })
    },
    async getTable({locale, mode}){
        return await get(settingMode[mode],{
            locale
        })
    }
}