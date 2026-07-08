import API from '../services/apiServices'

export const registerUser = (data)=> {
    return API.post('auth/register', data)
}

export const loginUser = (data)=>{
    return API.post("auth/login", data)
}

export const changePassword = (data)=> {
    return API.post("auth/change-password", data)
}