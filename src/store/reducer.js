import { SET_TODO_INPUT, ADD_TODO, DELETE_TODO, SELECT_TODO, IS_UPDATE } from "./constants";

const initState = {
    todos: [],
    todoInput: '',
    isUpdate: false,
}

function reducer(state, action) {
    switch (action.type) {
        case SET_TODO_INPUT:
            return {
                ...state,
                todoInput: action.payload
            }
        case ADD_TODO:
            return {
                ...state,
                todos: [
                   ...state.todos,
                    action.payload
                ]
            }
        case DELETE_TODO:
            const newTodos = [...state.todos]
            newTodos.splice(action.payload, 1)
            return {
                ...state,
                todos: newTodos
            }
        case SELECT_TODO:
            return {
                ...state,
                todoInput: state.todos[action.payload]
            }
        case IS_UPDATE:
            return {
                ...state,
                isUpdate:!action.payload
            }
        default:
            throw new Error(`Invalid action ${action.type}`)
    }
}

export { initState}
export default reducer;