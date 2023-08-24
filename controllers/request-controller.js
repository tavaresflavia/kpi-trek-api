const knex = require('knex')(require('../knexfile'));

const findAssignedToMe = (req,res) => {
     knex("request")
        .join("user", "user.id", "request.created_by")
        .where("assigned_to","=",req.body.userId) 
        .then((requestsFound) => {
            console.log(requestsFound);
            if (requestsFound.length === 0){
                return res
                .status(404)
                .send(`Requests for user with ID: ${req.body.user} not found`)
            }
            res.status(200).json(requestsFound);

        })
        .catch(() =>{
            res.status(500).send(`Unable to retrieve request data for user with ID: ${req.body.user}`)
        })

}

module.exports = {
    findAssignedToMe,
    // findCreatedByMe,

    
}