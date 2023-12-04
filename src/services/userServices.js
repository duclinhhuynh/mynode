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
            let userData  = {};
            let isExit = await checkUserEmail(email)
            if(isExit){
                let user = await db.User.findOne({
                    where: {email : email},
                    raw: true,
                });
                if(user){
                    let check  = await bcrypt.compareSync(password,  user.password)
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    }
                    else{
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }else {
                    userData.errCode = 2;
                    userData.errMessage = "User is not found"
                }
                //    bcrypt.compareSync("not_bacon", hash)//false
            }else{
                userData.errCode = 1;
                userData.errMessage = `Your's Email in't exit`
            }
            resolve(userData)
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
            if(check == true){
                resolve({
                    errCode: 1,
                    message: 'Your email is already in used'
                })
            }
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
            resolve({
                errCode: 0,
                message: 'OK'
            });
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
            if(!data.id){
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
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    checkUserEmail: checkUserEmail,
    hashUserPassword: hashUserPassword,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData:  updateUserData,
}