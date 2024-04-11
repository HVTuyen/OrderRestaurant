import { SET_TODO_INPUT, ADD_TODO, DELETE_TODO, SELECT_TODO, IS_UPDATE } from './constants'

export const setTodoInput = payload => ( {
    type: SET_TODO_INPUT,
    payload
})

export const addTodo = payload => ( {
    type: ADD_TODO,
    payload
})

export const deleteTodo = payload => ( {
    type: DELETE_TODO,
    payload
})

export const selectTodo = payload => ( {
    type: SELECT_TODO,
    payload
})

export const isUpdate = payload => ( {
    type: IS_UPDATE,
    payload
})