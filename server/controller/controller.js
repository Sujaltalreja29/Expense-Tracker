const model = require('../models/model');
const express = require('express');

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

//  ]post: http://localhost:8080/api/categories
async function create_categories(req, res) {
    const Create = new model.Categories({
        type: "Investment",
        color: "#FCBE44"
    })

    await Create.save(function (err) {
        if (!err) return res.json(Create);
        return res.status(400).json({ message: `Error while creating categories ${err}` });
    });
}

//  get: http://localhost:8080/api/categories
async function get_categories(req, res) {
    let data = await model.Categories.find({})

    let filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color }));
    return res.json(filter);
}

//  post: http://localhost:8080/api/transaction
async function create_transaction(req, res) {

    if (!req.body) return res.status(400).json("Post HTTP Data not Provided");

    let { name, type, amount, color } = req.body;
    // Assign default colors if `color` is not provided in the request
    if (!color) {
        if (type === "Expense") {
            color = "#ff0000"; // Red for Expense
        } else if (type === "Savings") {
            color = "#90ee90"; // Light Green for Savings
        } else {
            color = "#FCBE44"; // Default Yellow for Investment or others
        }
    }
    // Create the transaction document
    const create = new model.Transaction({
        name,
        type,
        amount,
        color,
        date: new Date()
    });


    // Save the document and handle errors
    create.save(function (err) {
        if (!err) {
            console.log("Transaction saved successfully:", create);
            return res.json(create);
        }
        console.error("Error saving transaction:", err);
        return res.status(400).json({ message: `Error while creating transaction ${err}` });
    });
}


//  get: http://localhost:8080/api/transaction
async function get_transaction(req, res) {
    let data = await model.Transaction.find({})
    return res.json(data);
}

//  delete: http://localhost:8080/api/transaction
async function delete_transaction(req, res) {
    if (!req.body) return res.status(400).json({ message: "Request body not found" });
    await model.Transaction.deleteOne(req.body, function (err) {
        if (!err) return res.json("Record Deleted...!")
    }).clone().catch(function (err) { if (err) res.json("Error while deleting Transaction record") });
}

//  get: http://localhost:8080/api/labels
async function get_labels(req, res) {
    try {
        const result = await model.Transaction.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "type",
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            {
                $unwind: "$categories_info"
            }
        ]);

        const data = result.map(v => ({
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color : v.color,
            color: v.categories_info.color
        }));

        res.json(data);
    } catch (error) {
        console.error("Error during aggregation:", error);
        res.status(400).json({ error: "Lookup Collection Error", details: error.message });
    }
}
 

module.exports = {
    create_categories,
    get_categories,
    create_transaction,
    get_transaction,
    delete_transaction,
    get_labels
}