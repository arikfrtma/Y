import { useState } from 'react';
import Head from 'next/head';
import PackageCard from '../components/PackageCard';
import PaymentModal from '../components/PaymentModal';
import StatusAlert from '../components/StatusAlert';

const packages = [
  { id: 1, name: '1GB RAM', price: 2000, ram: 1024 },
  { id: 2, name: '2GB RAM', price: 3000, ram: 2048 },
  { id: 3, name: '3GB RAM', price: 4000, ram: 3072 },
  { id: 4, name: '4GB RAM', price: 5000, ram: 4096 },
  { id: 5, name: '5GB RAM', price: 6000, ram: 5120 },
  { id: 6, name: '6GB RAM', price: 7000, ram: 6144 },
  { id: 7, name: '7GB RAM', price: 8000, ram: 7168 },
  { id: 8, name: '8GB RAM', price: 9000, ram: 8192 },
  { id: 9, name: '9GB RAM', price: 10000, ram: 9216 },
  { id: 10, name: '10GB RAM', price: 11000, ram: 10240 },
  { id: 11, name: 'Unlimited RAM', price: 15000, ram: 0 },
  { id: 12, name: 'Admin Panel', price: 20000, ram: 0, isAdmin: true }
];

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrder = async (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package: pkg
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderId(data.orderId);
        // Polling untuk status pembayaran
        checkPaymentStatus(data.orderId);
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentStatus('error');
    }
  };

  const checkPaymentStatus = async (orderId) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 menit dengan interval 10 detik
    
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(`/api/order?orderId=${orderId}`);
        const data = await response.json();
        
        if (data.status === 'paid') {
          clearInterval(interval);
          setPaymentStatus('success');
          setTimeout(() => {
            setIsModalOpen(false);
            setPaymentStatus(null);
            setSelectedPackage(null);
          }, 5000);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPaymentStatus('timeout');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPaymentStatus('error');
        }
      }
    }, 10000); // Cek setiap 10 detik
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Pterodactyl Panel Store</title>
        <meta name="description" content="Beli server Pterodactyl Panel" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Pterodactyl Panel Store</h1>
        
        {paymentStatus && (
          <StatusAlert status={paymentStatus} onClose={() => setPaymentStatus(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard 
              key={pkg.id}
              pkg={pkg}
              onOrder={() => handleOrder(pkg)}
            />
          ))}
        </div>
      </main>

      {isModalOpen && selectedPackage && (
        <PaymentModal
          package={selectedPackage}
          orderId={orderId}
          onClose={() => {
            setIsModalOpen(false);
            setPaymentStatus(null);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
}