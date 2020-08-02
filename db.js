const mongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;

function connectDataBase() {
    if (!global.connection) {
        mongoClient.connect(process.env.MONGODB_CONNECTION, { useUnifiedTopology: true })
            .then(conn => {
                global.connection = conn.db('projeto-crud');
                console.log('Conectado!');
            })
            .catch(err => {
                console.log(err);
                global.connection = null;
            })
    }
}

function findCustomers() {
    connectDataBase();
    return global.connection
        .collection('customers')
        .find({})
        .toArray();
}

function insertCustomers(customer) {
    connectDataBase();
    return global.connection
        .collection('customers')
        .insertOne(customer);
}

function updateCustomer(id, customer) {
    connectDataBase();
    return global.connection
        .collection('customers')
        .updateOne({ _id: objectId(id) }, { $set: customer });
}

function deleteCustomer(id) {
    connectDataBase();
    return global.connection
        .collection('customers')
        .deleteOne({ _id: objectId(id) });
}

function findCustomer(id) {
    connectDataBase();
    return global.connection
        .collection('customers')
        .findOne({ _id: objectId(id) });
}


module.exports = { findCustomers, findCustomer, insertCustomers, updateCustomer, deleteCustomer }