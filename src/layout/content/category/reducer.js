import {SET_CATEGORY, SET_CATEGORIES} from './constants'

export const initState = {
    category: '',
    categories: []
}

const reducer = (state, action) => {
    switch (action.type) {
        case SET_CATEGORY:
            return {
               ...state,
                category: action.payload
            }
        case SET_CATEGORIES:
            return {
               ...state,
                categories: action.payload
            }
        
        default:
            throw new Error(`Invalid action ${action.type}`)
    }
}

export default reducer