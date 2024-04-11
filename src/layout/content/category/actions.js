import {SET_CATEGORY, SET_CATEGORIES} from './constants'

export const setCategory = payload => {
    return {
        type: SET_CATEGORY,
        payload
    }
}

export const setCategories = payload => {
    return {
        type: SET_CATEGORIES,
        payload
    }
}