import {SET_CATEGORY, SET_CATEGORIES} from './constants'

export const initState = {
    category: '',
    categories: [],
    categoriessearch: [],
}

const reducer = (state, action) => {
    console.log('state', state)
    switch (action.type) {
        case SET_CATEGORY:
            return {
               ...state,
               category: action.payload,
               categoriessearch: state.categories.filter(category => category.title.includes(action.payload))
            }
        case SET_CATEGORIES:
            return {
               ...state,
                categories: [...action.payload],
                categoriessearch: [...action.payload]
            }
        
        default:
            throw new Error(`Invalid action ${action.type}`)
    }
}

export default reducer