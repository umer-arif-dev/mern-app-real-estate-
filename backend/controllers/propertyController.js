const Property = require('../models/Property');

// Create Property
const createProperty = async (req, res) => {
    try {
        const {
            title,
            location,
            price,
            bedrooms,
            bathrooms,
            area,
            image
        } = req.body;

        const property = await Property.create({
            title,
            location,
            price,
            bedrooms,
            bathrooms,
            area,
            image,
            user: req.user._id
        });

        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Property
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                message: 'Property not found'
            });
        }

        if (property.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: 'Not authorized'
            });
        }

        await property.deleteOne();

        res.json({
            message: 'Property deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createProperty,
    getProperties,
    deleteProperty
};