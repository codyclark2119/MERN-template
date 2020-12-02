import axios from 'axios';

const api = {
    // A call to verify user token information
    loadUser: () => {
        if(localStorage.token){
            return axios.get({
                url: '/api/auth/',
                // Sending the custom header with our localstorage token
                headers: {'x-auth-token': localStorage.token}
            })
        } else return null;
    },
    // A call to register the user to the database
    register: (userData) => {
        return axios.post({
            url:'/api/user',
            data: userData
        })
    },
    // A call to check user credentials to login
    login: (userData) => {
        return axios.post({
            url:'/api/auth',
            data: userData
        })
    }
}
export default api;