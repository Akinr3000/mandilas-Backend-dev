const productquery = require("../model/Product");

exports.getquery = async (req, res) => {
    try{
        let show = await productquery.find({
            "$or":[
                    {name:{$regex:req.params.key}},
                    {description:{$regex:req.params.key}},
                    {price:{$regex:req.params.key}},
            ]
        })
        res.send(show)
    }catch{
        res.send("not found")
    }
    
};