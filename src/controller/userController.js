import userService from "../services/userServices"
let handleLogin = async(req,res) => {
    let email = req.body.email;
    // console.log('your email', +email);
    let password = req.body.password;

    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: 'missing inputs parameter!'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        userData
    });
}
let handleGetAllUsers = async(req ,res) => {
    let id = req.query.id;
    console.log(users);
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'missing required',
            users: []
    
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users

    })

}
let handleCreateNewUser = async(req, res) => {
    let message = await userService.createNewUser(req.body)
    console.log(message);
    return res.status(200).json(message);
}
let handleEditUser = async(req,res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
}
let handleDeleteUser = async(req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: "missing required parameters!"
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message);
}
let getAllcode = async(req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'err from server'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllcode: getAllcode,
}