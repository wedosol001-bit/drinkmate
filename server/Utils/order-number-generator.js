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
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      // Create date prefix (YYYYMMDD)
      const datePrefix = `${year}${month}${day}`;
      
      // Get the count of orders created today
      const startOfDay = new Date(year, now.getMonth(), now.getDate());
      const endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);
      
      // Count existing orders for today with this format
      const todayOrdersCount = await OrderModel.countDocuments({
        orderNumber: { $regex: `^DM-${datePrefix}-` },
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
      
      // Generate sequential number (padded to 4 digits)
      const sequenceNumber = String(todayOrdersCount + 1).padStart(4, '0');
      
      // Format: DM-YYYYMMDD-XXXX
      const orderNumber = `DM-${datePrefix}-${sequenceNumber}`;
      
      return orderNumber;
    } catch (error) {
      console.error('Error generating order number:', error);
      // Fallback to timestamp-based ID
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substr(2, 4).toUpperCase();
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
