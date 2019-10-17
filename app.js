const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users']);
const ObjectId = mongojs.ObjectId;

const app = express();

/*
const logger = function(req, res, next){
    console.log('Logging...');
    next();
};

app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    db.users.find((err, docs) => {

        res.render('index', {
            title: 'Customers',
            users: docs
        });
    });
});

app.post('/users/add', (req, res) => {
    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    };
    
    db.users.insert(newUser, (err, result) => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });

});

app.delete('/users/delete/:id', (req, res) => {
    db.users.remove({_id: ObjectId(req.params.id)}, () => res.redirect('/'));
});

app.listen(3000, () => console.log('Server started on port 3000...'));
