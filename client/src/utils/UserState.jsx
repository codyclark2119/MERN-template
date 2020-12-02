import React, { createContext, useReducer, useContext } from "react";
import { CREATE_USER, LOGIN_USER, USER_LOADED, DELETE_USER, LOGOUT, AUTH_ERROR, LOGIN_FAIL, REGISTER_FAIL } from "./actions";

// Creating then destructuring the context
const UserContext = createContext();
const { Provider } = UserContext;

// Setting up a reducer function to be called to change global state
const reducer = (state, action) => {
    switch (action.type) {
        // Each of the cases are a seperate possible way to update state
        // On a successful load of user data, updates the user object in state with the data
        case USER_LOADED:
            return {
                // Spreading state values before updating them
                ...state,
                // Basic boolean for if authenticated for easy check
                isAuthenticated: true,
                // Specific needed user information stored as an object
                user: action.data
            };
        // On successful login/register set token in local storage
        case CREATE_USER:
        case LOGIN_USER:
            // Setting token in local storage for login memory
            localStorage.setItem('token', action.token);
            return {
                // Spreading state values before updating them
                ...state,
                // Basic boolean for if authenticated for easy check
                isAuthenticated: true
            };
        // On any auth failure clear local storage and reset state to no permissions
        case DELETE_USER:
        case LOGOUT:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case AUTH_ERROR:
            // Removing any possible local storage values
            localStorage.removeItem('token');
            return {
                // Resetting back to inital state
                ...state,
                isAuthenticated: false,
                user: null
            };
        default:
            return state;
    }
}

// Creating a function that provides the inital global state values
const UserProvider = ({ value = {}, ...props }) => {
    // Destructuring the state values and dispatch function from the created reducer
    const [state, dispatch] = useReducer(reducer, 
        // Inital global state
        {
            isAuthenticated: null,
            user: null
        }
    );
    // Returning provider component for use
    return <Provider value={[state, dispatch]} {...props} />;
};

// Creating a function that will return the state and dispatch functions
const useUserContext = () => {
    return useContext(UserContext);
};

export { UserProvider, useUserContext };