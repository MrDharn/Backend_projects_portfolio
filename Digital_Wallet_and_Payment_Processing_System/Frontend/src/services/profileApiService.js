import API from "./apiServices"

export const getProfile = async()=>{
    const response = await API.get('/wallet/profile')
    return response.data
}