const axios = require('axios');
baseURL="http://localhost:3001"
    const AuthServices = {
        loginUser: async (body) => {
            return axios.post("http://localhost:3001/api/user/login", body)
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    throw error
                })
        },
    registerUser: async (body) => {
        return axios.post(`http://localhost:3001/api/user/register`, body)
            .then(response => {
                console.log("responsedata",response.data);
                return response.data
            })
            .catch(error => {
                throw error
            })
    },
    getAllStudents: async (body) => {
        return axios.get(`${baseURL}/api/student/all`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                throw error
            })
    },
    getAllUsers: async (body) => {
        return axios.get(`${baseURL}/api/user/all`)
            .then(response => {
                return response.data
            })
            .catch(error => {
                throw error
            })
    }
};

module.exports = AuthServices;