/**
 * Order Number Generator Utility
 * Generates human-friendly order numbers in format: DM-YYYYMMDD-XXXX
 * Example: DM-20260112-0001
 */

class OrderNumberGenerator {
  /**
   * Generate a human-friendly order number
   * Format: DM-YYYYMMDD-XXXX (where XXXX is a sequential number for the day)
   * 
   * @param {mongoose.Model} OrderModel - The Order model to check for existing orders
   * @returns {Promise<string>} Generated order number
   */
  static async generateOrderNumber(OrderModel) {
    try {
      const Sequence = require('../Models/sequence-model');
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      // Create date prefix (YYYYMMDD)
      const datePrefix = `${year}${month}${day}`;
      const sequenceId = `order_number_${datePrefix}`;

      // Atomically get and increment the sequence number
      // upsert: true creates the document if it doesn't exist
      // new: true returns the updated document
      const sequenceDoc = await Sequence.findByIdAndUpdate(
        sequenceId,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

      // Generate sequential number (padded to 4 digits)
      const sequenceNumber = String(sequenceDoc.sequence_value).padStart(4, '0');

      // Format: DM-YYYYMMDD-XXXX
      const orderNumber = `DM-${datePrefix}-${sequenceNumber}`;

      return orderNumber;
    } catch (error) {
      console.error('Error generating order number:', error);
      // Fallback to timestamp-based ID with high randomness to prevent collision
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      return `DM-${timestamp}-${random}`;
    }
  }

  /**
   * Generate order number synchronously (without database check)
   * Use this for frontend/client-side generation
   * Format: DM-YYYYMMDD-XXXX (where XXXX is random)
   * 
   * @returns {string} Generated order number
   */
  static generateOrderNumberSync() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();

    // Format: DM-YYYYMMDD-XXXX
    return `DM-${year}${month}${day}-${random}`;
  }
}

module.exports = OrderNumberGenerator;
