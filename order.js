import { createOrder, checkOrderStatus } from '../../lib/orderkuota';
import { createServer } from '../../lib/pterodactyl';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { package: pkg } = req.body;
      
      // Buat order di OrderKuota
      const orderResponse = await createOrder({
        product_code: process.env.ORDERKUOTA_PRODUCT_CODE,
        customer_ref: `pterodactyl-${Date.now()}`,
        amount: pkg.price,
        customer_email: 'customer@pterodactyl.com',
        customer_name: 'Pterodactyl Customer',
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`
      });

      if (orderResponse.success) {
        return res.status(200).json({
          success: true,
          orderId: orderResponse.data.order_id,
          paymentUrl: orderResponse.data.payment_url
        });
      } else {
        return res.status(400).json({
          success: false,
          message: orderResponse.message || 'Failed to create order'
        });
      }
    } catch (error) {
      console.error('Error in order API:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'GET') {
    // Cek status order
    const { orderId } = req.query;
    
    try {
      const statusResponse = await checkOrderStatus(orderId);
      return res.status(200).json(statusResponse);
    } catch (error) {
      console.error('Error checking order status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check order status'
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}