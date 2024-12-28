const { MongoClient } = require( "mongodb");
let dbdata
module.exports = {
    connection : (para) => {
       MongoClient.connect('mongodb://localhost:27017/TodoData')
       .then(result => {
        dbdata = result.db()
        return para()
       })
       .catch(err => {
        return para(err)
       })
    }, 
    getDb: () => dbdata 
}