const form = require("../model/sellers-val");

exports.get = async (req,res)=>{
    try{
        await res.send("welcome to seller's page")
    }catch (err){
        console.log(err);
    }
    }
    

exports.postseller = async (req,res)=>{
    try{
        const data = new form({
            storename:req.body.storename,
            business:req.body.business,
            address:req.body.address,
            LGA:req.body.LGA,
            city:req.body.city,
            state:req.body.state,
            approved:req.body.approved
        });
        await data.save();
        res.redirect("/api/product");
    }catch(error) {
        console.log(error);
        res.sendstatus(500)
    } 
}

