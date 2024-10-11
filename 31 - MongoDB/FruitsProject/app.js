// Import mongoose package
const mongoose = require('mongoose');

// Connect to MongoDB and create a new database 'fruitsDB'
mongoose.connect('mongodb://localhost:27017/fruitsDB')
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.log('Connection error:', error);
    });

// Define a schema for the 'fruits' collection
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Fruit name is required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

// Create a model for the 'fruits' collection
const Fruit = mongoose.model('Fruit', fruitSchema);

// Define a schema for the 'people' collection
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Person name is required']
    },
    age: {
        type: Number,
        min: 0
    },
    favoriteFruit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fruit' // Reference to the Fruit model
    }
});

// Create a model for the 'people' collection
const Person = mongoose.model('Person', personSchema);

// Insert an array of fruits and people using async/await
async function insertArrays() {
    try {
        // Array of fruits to insert
        const fruitsArray = [
            { name: 'Apple', rating: 8, review: 'Crispy and delicious!' },
            { name: 'Orange', rating: 7, review: 'Juicy and refreshing!' },
            { name: 'Grapes', rating: 9, review: 'Sweet and tangy!' }
        ];

        // Insert multiple fruits using insertMany()
        const savedFruits = await Fruit.insertMany(fruitsArray);
        console.log('Fruits saved to fruitsDB:', savedFruits);

        // Array of people to insert
        const peopleArray = [
            { name: 'Alice', age: 25, favoriteFruit: savedFruits.find(fruit => fruit.name === 'Apple')._id },
            { name: 'Bob', age: 35, favoriteFruit: savedFruits.find(fruit => fruit.name === 'Grapes')._id },
            { name: 'Charlie', age: 40 }
        ];

        // Insert multiple people using insertMany()
        const savedPeople = await Person.insertMany(peopleArray);
        console.log('People saved to fruitsDB:', savedPeople);

        // Find and log only the names from the fruits collection
        const fruits = await Fruit.find({}, { name: 1, _id: 0 });
        console.log('Fruits (only names):');
        fruits.forEach(fruit => console.log(fruit.name));

       // Find and log only the names from the people collection
       const people = await Person.find({}, { name: 1, _id: 0 }).populate('favoriteFruit');
       console.log('People (only names and favorite fruits):');
       people.forEach(person => {
           console.log(`${person.name} - Favorite Fruit: ${person.favoriteFruit ? person.favoriteFruit.name : 'None'}`);
       });

        // Close the connection after saving
        mongoose.connection.close();
    } catch (err) {
        console.error('Error saving data:', err);
    }
}

// Function to remove duplicates based on the 'name' field
async function removeDuplicates() {
    try {
        // Finding and deleting duplicate fruits
        const fruitDuplicates = await Fruit.aggregate([
            { $group: { _id: "$name", count: { $sum: 1 }, docs: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        for (const fruit of fruitDuplicates) {
            const [first, ...rest] = fruit.docs;  // Keep the first, delete the rest
            await Fruit.deleteMany({ _id: { $in: rest } });
        }
        console.log('Duplicate fruits removed.');

        // Finding and deleting duplicate people
        const peopleDuplicates = await Person.aggregate([
            { $group: { _id: "$name", count: { $sum: 1 }, docs: { $push: "$_id" } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        for (const person of peopleDuplicates) {
            const [first, ...rest] = person.docs;  // Keep the first, delete the rest
            await Person.deleteMany({ _id: { $in: rest } });
        }
        console.log('Duplicate people removed.');

        // Close the connection after removing duplicates
        mongoose.connection.close();
    } catch (err) {
        console.error('Error finding or deleting duplicates:', err);
    }
}

// Call the function to insert arrays of fruits and people
 insertArrays();

// Call the function to remove duplicate entries
// removeDuplicates();
