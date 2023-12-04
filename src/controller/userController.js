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

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
}