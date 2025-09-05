const express = require('express');
// const propertyRoutes = require('./propertyRoutes');
// const userRoutes = require('./userRoutes');
// const authRoutes = require('./authRoutes');
const {signUp , signIn , checkAuth, signOut}=require('../middleware');
const mongoose = require('mongoose');
const router = express.Router();
const Property = require('../models/property');
const User=require('../models/users');
const Visit = require('../models/visit');
// Example route imports

// Mount routes
// router.use('/properties', propertyRoutes);
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
// Default route
router.use('/protected', checkAuth, (req, res) => {
    res.json({ role: req.user.role, name: req.user.name, id: req.user.id });
})





router.get('/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        console.log(properties);
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});


router.post('/properties', checkAuth, async (req, res) => {
    try {
        console.log(req.body);
        const newProperty = new Property({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location,
            propertyType: req.body.propertyType,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            amenities: req.body.amenities,
            images: "/src/assets/project_img_1.jpg",
            listedBy: req.user.id
        });
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create property' });
    }
});

router.get('/agent-properties',checkAuth, async (req, res) => {
    try {
        // console.log(req.user);
        if(!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const properties = await Property.find({ listedBy: req.user.id });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});
     
router.get('/property/:id',checkAuth, async (req, res) => {
    try {
        console.log(req.params.id);
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch property details' });
    }
})

router.put('/property/:id', checkAuth, async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update property' });
    }
});

router.delete('/property/:id', checkAuth, async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete property' });
    }
});

router.post('/add-to-wishlist', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const propertyId = req.body.propertyId;
        // console.log(req.body);
        // Find the user and add the property to their wishlist
        await User.findByIdAndUpdate(userId, { $addToSet: { wishList: propertyId } });
        res.status(200).json({ message: 'Property added to wishlist' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to add property to wishlist' });
    }
});
router.get('/wishlist', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('wishList');
        const propertyIds = user.wishList.map(property => property._id);
        res.json(propertyIds);
        // res.json(user.wishList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

router.post('/make-appointment', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const propertyId = req.body.propertyId;
        const property = await Property.findOne({ _id: propertyId });
        console.log(property);
        const visit = new Visit({
            user_id: userId,
            property_id: propertyId,
            property_listed_user_id: property.listedBy,
            scheduledAt: req.body.scheduledAt // expects a date/time from frontend
        });
        await visit.save();
        res.status(200).json({ message: 'Visit scheduled', visit });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to make appointment' });
    }
});


router.get('/appointments', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Visit.find({ user_id: userId });
        const propertyArray = appointments.map(app => app.property_id);
        res.json(propertyArray);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

router.get('/agent-appointments', checkAuth, async (req, res) => {
    try {
        if(req.user.role !== 'AGENT') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const userId = req.user.id;
        const appointments = await Visit.find({ property_listed_user_id: userId });
        res.json(appointments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch agent appointments' });
    }
});

router.post('/agent-appointments/:id', checkAuth, async (req, res) => {
    try {
        if(req.user.role !== 'AGENT') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const appointmentId = req.params.id;
        const appointment = await Visit.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        appointment.status = req.body.status; // expects 'Accepted' or 'Rejected' from frontend
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to accept appointment' });
    }
});

router.post('/auth/signout', signOut);

router.get('/', (req, res) => {
    res.json({mes:'Real Estate App API'});
    console.log('API Root Endpoint Hit');
});

module.exports = router;