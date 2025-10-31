const Address = require('../Models/address-model');
const User = require('../Models/user-model');

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const addresses = await Address.find({
      user: userId,
      isActive: true
    }).sort({ isDefault: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: addresses,
      count: addresses.length
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
};

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      phone,
      district,
      city,
      country = 'Saudi Arabia',
      nationalAddress,
      isDefault = false
    } = req.body;
    
    // Validation
    if (!fullName || !phone || !district || !city) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone, district, and city are required'
      });
    }
    
    // Validate phone format
    if (!/^\+966\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must start with +966 and contain 9 digits'
      });
    }
    
    // Validate national address format if provided
    if (nationalAddress && !/^[A-Z]{4}[0-9]{4}$/.test(nationalAddress.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'National Address must be 4 letters followed by 4 numbers (e.g., JESA3591)'
      });
    }
    
    // If this is set as default, unset all others
    if (isDefault) {
      await Address.updateMany(
        { user: userId },
        { $set: { isDefault: false } }
      );
    }
    
    const address = new Address({
      user: userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      district: district.trim(),
      city: city.trim(),
      country: country.trim(),
      nationalAddress: nationalAddress ? nationalAddress.toUpperCase().trim() : '',
      isDefault: isDefault
    });
    
    await address.save();
    
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: error.message
    });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const {
      fullName,
      phone,
      district,
      city,
      country,
      nationalAddress,
      isDefault
    } = req.body;
    
    // Find address and verify ownership
    const address = await Address.findOne({
      _id: id,
      user: userId,
      isActive: true
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Validate phone format if provided
    if (phone && !/^\+966\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must start with +966 and contain 9 digits'
      });
    }
    
    // Validate national address format if provided
    if (nationalAddress && !/^[A-Z]{4}[0-9]{4}$/.test(nationalAddress.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'National Address must be 4 letters followed by 4 numbers (e.g., JESA3591)'
      });
    }
    
    // Update fields
    if (fullName) address.fullName = fullName.trim();
    if (phone) address.phone = phone.trim();
    if (district) address.district = district.trim();
    if (city) address.city = city.trim();
    if (country) address.country = country.trim();
    if (nationalAddress !== undefined) {
      address.nationalAddress = nationalAddress ? nationalAddress.toUpperCase().trim() : '';
    }
    
    // Handle default address change
    if (isDefault !== undefined && isDefault !== address.isDefault) {
      if (isDefault) {
        // Unset all other default addresses
        await Address.updateMany(
          { user: userId, _id: { $ne: id } },
          { $set: { isDefault: false } }
        );
      }
      address.isDefault = isDefault;
    }
    
    address.updatedAt = Date.now();
    await address.save();
    
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

// Delete an address (soft delete)
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // Find address and verify ownership
    const address = await Address.findOne({
      _id: id,
      user: userId
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Soft delete by setting isActive to false
    address.isActive = false;
    await address.save();
    
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
};

// Set address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // Find address and verify ownership
    const address = await Address.findOne({
      _id: id,
      user: userId,
      isActive: true
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Unset all other default addresses
    await Address.updateMany(
      { user: userId, _id: { $ne: id } },
      { $set: { isDefault: false } }
    );
    
    // Set this as default
    address.isDefault = true;
    await address.save();
    
    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message
    });
  }
};

