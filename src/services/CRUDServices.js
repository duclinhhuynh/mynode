import bcrypt from'bcryptjs';
import db from '../models';
const salt = bcrypt.genSaltSync(10);
let createNewuser = async (data) => {
    return new Promise( async(resolve, reject)=> {
        try {
            let hashPasswordFromBscrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBscrypt,
                firstName:data.firstName, 
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false ,
                roleId: data.roleId,
            })
            resolve('create a new user succeseed');
            // console.log('data from services');
            // console.log(data);
            // console.log(hashPasswordFromBscrypt);
        } catch (error) {
            reject(error)
        }
    })

   
}
let getAllUser = () => {
    return new Promise(async (resolve , reject)=> {
    try {
        let users = db.User.findAll({
            raw: true,
        });
        resolve(users);
    } catch (error) {
        console.log(error);
    }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
        
    })
}
module.exports = {
    createNewuser: createNewuser,
    getAllUser: getAllUser
}