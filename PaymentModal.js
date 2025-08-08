import QRCode from 'react-qr-code';

const PaymentModal = ({ package: pkg, orderId, onClose }) => {
  const paymentUrl = `https://orderkuota.com/pay/${orderId}`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Pembayaran {pkg.name}</h2>
        <p className="mb-4">Total: Rp{pkg.price.toLocaleString()}</p>
        
        <div className="flex justify-center mb-4">
          <QRCode 
            value={paymentUrl} 
            size={200} 
            level="H" 
          />
        </div>
        
        <p className="text-sm text-gray-600 mb-4 text-center">
          Scan QR code di atas atau klik tombol di bawah untuk membayar
        </p>
        
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium py-2 px-4 rounded-md mb-4"
        >
          Buka Halaman Pembayaran
        </a>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;