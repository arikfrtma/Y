import { checkOrderStatus } from '../../lib/orderkuota';
import { createServer } from '../../lib/pterodactyl';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { order_id } = req.body;
    
    try {
      // Verifikasi status pembayaran
      const statusResponse = await checkOrderStatus(order_id);
      
      if (statusResponse.status === 'paid') {
        // Dapatkan informasi order (simpan di database di implementasi real)
        // Untuk demo, kita asumsikan data package tersedia di metadata
        const pkg = {
          ram: statusResponse.metadata?.ram || 1024,
          isAdmin: statusResponse.metadata?.isAdmin || false
        };
        
        // Buat server di Pterodactyl
        const serverResponse = await createServer({
          name: `Server-${order_id.substring(0, 8)}`,
          userId: 1, // ID user di Pterodactyl
          memory: pkg.ram,
          isAdmin: pkg.isAdmin
        });
        
        if (serverResponse.success) {
          return res.status(200).json({ success: true });
        } else {
          console.error('Failed to create server:', serverResponse.message);
          return res.status(500).json({ success: false });
        }
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error in webhook:', error);
      return res.status(500).json({ success: false });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}