import db from '../models/index';
import CRUDservices from '../services/CRUDservices';

let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
        
    } catch (error) {
        console.log(error)
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getCRUD = (req, res) => {
    return res.render('test/crud.ejs');   
}
let postCRUD = async(req,res) => {
    let mg = await CRUDservices.createNewuser(req.body);
    console.log(mg);
    console.log(req.body);
    return res.send("post to server");
}
let displayGetCRUD = async(req, res) => {
    let data = await CRUDservices.getAllUser();
    console.log(data);
    return res.render('test/displayCRUD.ejs', {
        dataTable: data
    })
}
let getEditCRUD = async(req, res) => {
    let userId = req.query.id;
    console.log(req.query.id);
    if(userId){
        let userData = await CRUDservices.getUserInfoById(userId);
        console.log(userData);
         return  res.render('test/editCRUD.ejs', {
            user: userData
         });
    }
    else{
        return  res.send('hello from edit page');
    }
}
let putCRUD = async(req, res) => {
    let data = req.body;
    let allUsers = await CRUDservices.updateUserData(data);
    return res.render('test/displayCRUD.ejs', {
        dataTable: allUsers,
    })
}
// object: {
// key:
// value:
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
}