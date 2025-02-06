require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3010;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI; // Use environment variable for security

mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB Connection Error:', err);
});

// Define MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Routes

// Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

// Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Error creating menu item' });
  }
});

// Update an existing menu item
app.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Error updating menu item' });
  }
});

// Delete a menu item
app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
