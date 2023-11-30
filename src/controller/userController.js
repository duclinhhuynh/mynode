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

module.exports = {
    handleLogin: handleLogin,
}