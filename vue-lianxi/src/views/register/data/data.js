import {login} from '@api'
export default{

    async login(username,password){
        return await login(username,password).catch((error)=>{
            throw error
        })
    }
}