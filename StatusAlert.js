const StatusAlert = ({ status, onClose }) => {
  const getAlertDetails = () => {
    switch (status) {
      case 'success':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          message: 'Pembayaran berhasil! Server sedang diproses.'
        };
      case 'error':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          message: 'Terjadi kesalahan. Silakan coba lagi.'
        };
      case 'timeout':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          message: 'Waktu pembayaran habis. Silakan buat pesanan baru.'
        };
      default:
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          message: 'Memproses...'
        };
    }
  };

  const { bgColor, textColor, message } = getAlertDetails();

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-md mb-6 flex justify-between items-center`}>
      <p>{message}</p>
      <button onClick={onClose} className="font-bold ml-4">
        &times;
      </button>
    </div>
  );
};

export default StatusAlert;