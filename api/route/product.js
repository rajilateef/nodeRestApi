const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Handling GET REQUESTS TO /PRODUCTS'
    // });
    // Product.find().sort({date: -1}).then(items => console.log(res.json(items)));

    Product.find().sort({date: -1}).exec()
        .then( doc => {
            console.log(doc);
            if(doc.length >= 0){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message: 'No entries found'
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            CretedProduct: result
        });
    }).catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(doc => {
            console.log("From database:", doc);
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }

        }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: 'You discovered the special ID',
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
});

router.patch('/:productId', (req, res, next) => {
 const id = req.params.productId;
 const updateOps = {};
 for (const ops of req.body){
     updateOps[ops.propName] = ops.value;
 }
 Product.update({_id: id}, {$set: updateOps}).exec()
     .then( doc => {
         console.log();
         res.status(200).json(doc)
     })
     .catch(err =>{
         console.log(err);
         res.status(500).json({
             error: err
         });
     });
});
router.delete('/:productId', (req, res, next) => {
const id = req.params.productId;
 Product.remove({_id: id}).exec()
     .then(result => {
         console.log(result);
         res.status(200).json(result);
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({
             error: err
         });
     });
});

module.exports = router;