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
// object: {
// key:
// value:
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
}