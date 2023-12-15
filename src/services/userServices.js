import db from "../models/index";
import bcrypt from'bcryptjs';

const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userInfo  = {};
            let isExit = await checkUserEmail(email)
            if(isExit){
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: {email : email},
                    raw: true,
                });
                if(user){
                    let check  = await bcrypt.compareSync(password,  user.password)
                    if(check){
                        userInfo.errCode = 0;
                        userInfo.errMessage = 'OK';
                        delete user.password;
                        userInfo.user = user;
                    }
                    else{
                        userInfo.errCode = 3;
                        userInfo.errMessage = 'Wrong password';
                    }
                }else {
                    userInfo.errCode = 2;
                    userInfo.errMessage = "User is not found"
                }
                //    bcrypt.compareSync("not_bacon", hash)//false
            }else{
                userInfo.errCode = 1;
                userInfo.errMessage = `Your's Email in't exit`
            }
            resolve(userInfo)
            console.log(userInfo.user);
        } catch (error) {
            
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email : userEmail}
            })
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (error) {
            console.log(error);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId}
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                    errCode: 1,
                    message: 'Your email is already in used'
                })
            }else{
                let hashPasswordFromBscrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBscrypt,
                    firstName:data.firstName, 
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
        }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise( async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: {id: userId}
        });
        if(!foundUser) {
            resolve({
                errCode: 2,
                errMessage: "the user isn''t "
            })
        }
        console.log("dd", foundUser);
        // if(foundUser) {
        //     await foundUser.destroy();
        // }
        await db.User.destroy({
            where: {id: userId}
        })
        resolve({
            errCode: 0,
            errMessage: `the user deleted `
        });
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false,
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName =  data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if(data.avatar){
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                });
            }else{
                resolve({
                    errCode: 1,
                    errMessage: 'user not'
                });
            }
        } catch (error) {
            reject(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!typeInput){
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required paremeters'
                })
            }
            else{
                let res = {}; 
                let allcode = await db.Allcode.findAll({
                    where: {type :typeInput}           
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    checkUserEmail: checkUserEmail,
    hashUserPassword: hashUserPassword,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData:  updateUserData,
    getAllCodeService: getAllCodeService,
}