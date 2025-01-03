const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// categories => field => ['type', 'color']
const categories_model = new Schema({
    type: { type: String},
    color: { type: String, default: '#FCBE44' }
})

// transactions => field => ['name', 'type', 'amount', 'date']
const transaction_model = new Schema({
    name: { type: String, default: 'Anonymous'},
    type: { type: String},
    amount: { type: Number },
    color : {type : String},
    date: { type: Date, default: Date.now}
})

const Categories = mongoose.model('categories', categories_model);
const Transaction = mongoose.model('transaction', transaction_model);

exports.default = Transaction;
module.exports = {
    Categories,
    Transaction
}