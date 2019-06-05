const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: 'Welcome to your todolist!'
});

const item2 = new Item({
    name: 'Hit the + button to add a new item.'
});

const item3 = new Item({
    name: '<-- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];


app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
        
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully saved default items!');
                }   
            });
            res.redirect('/');
        } else {
            res.render('list', { listTitle: "Today", newListItems: foundItems });
        }
    });
});

app.get('/:customListName', (req, res) => {
    const customListName =  req.params.customListName;


    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if(!foundList) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save(); 
                res.redirect('/' + customListName);
            } else {
                // Show an existin list
                res.render('list', { listTitle: foundList.name, newListItems: foundList.items });
            } 
        }
    });

});

app.post('/', (req, res) => {

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect('/');
});


app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;

        Item.findByIdAndRemove(checkedItemId, err => {
            if(!err) {
                console.log('Succesfully deleted checked item!');
                res.redirect('/');
            }
        });

});


app.get('/about', (req, res) => {
    res.render('about');
});


app.listen(3000, () => {
    console.log('Server started on port 3000.')
});