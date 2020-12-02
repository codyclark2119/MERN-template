import React, { useState, useEffect } from 'react'
import { useUserContext } from '../../utils/UserState';
import { USER_LOADED, AUTH_ERROR } from '../../utils/actions';
import API from '../../utils/API';

export default function Navbar() {
    const [state, dispatch] = useUserContext();

    useEffect(() => {
        const user = API.loadUser();
        if (user) {
            dispatch({
                type: USER_LOADED,
                data: user
            })
        } else {
            dispatch({
                type: AUTH_ERROR
            })
        }
    }, []);

    return (
        <div>
            {/* Based on the user state existing either render the users name or a request to login */}
            {state.user ? (
                <div>
                    {`Welcome ${state.user.first_name} ${state.user.last_name}`}
                </div>
            ) : (
                <div>
                    {`Please login or register`}
                </div>
            )}
        </div>
    )
}
