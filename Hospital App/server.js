// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();
const port = 3000;

// Set up middleware to parse JSON bodies
app.use(express.json());

// Path to the hospital data JSON file
const filePath = path.join(__dirname, 'hospitalData.json');

// Helper function to read data from the JSON file
const readData = () => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
};

// Helper function to write data to the JSON file
const writeData = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf-8');
};

// CRUD Operations

// 1. GET - Get all hospitals
app.get('/hospitals', (req, res) => {
    const hospitals = readData();
    res.json(hospitals);
});

// 2. POST - Add a new hospital
app.post('/hospitals', (req, res) => {
    const { name, patientCount, location } = req.body;

    if (!name || !patientCount || !location) {
        return res.status(400).json({ message: 'Missing hospital information.' });
    }

    const hospitals = readData();
    const newId = hospitals.length ? hospitals[hospitals.length - 1].id + 1 : 1;

    const newHospital = {
        id: newId,
        name,
        patientCount,
        location
    };

    hospitals.push(newHospital);
    writeData(hospitals);

    res.status(201).json(newHospital);
});

// 3. PUT - Update a hospital
app.put('/hospitals/:id', (req, res) => {
    const { id } = req.params;
    const { name, patientCount, location } = req.body;

    if (!name || !patientCount || !location) {
        return res.status(400).json({ message: 'Missing hospital information.' });
    }

    const hospitals = readData();
    const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(id));

    if (hospitalIndex === -1) {
        return res.status(404).json({ message: 'Hospital not found.' });
    }

    const updatedHospital = {
        id: parseInt(id),
        name,
        patientCount,
        location
    };

    hospitals[hospitalIndex] = updatedHospital;
    writeData(hospitals);

    res.json(updatedHospital);
});

// 4. DELETE - Delete a hospital
app.delete('/hospitals/:id', (req, res) => {
    const { id } = req.params;

    const hospitals = readData();
    const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(id));

    if (hospitalIndex === -1) {
        return res.status(404).json({ message: 'Hospital not found.' });
    }

    hospitals.splice(hospitalIndex, 1);
    writeData(hospitals);

    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Hospital app server is running on http://localhost:${port}`);
});
