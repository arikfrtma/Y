const PackageCard = ({ pkg, onOrder }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
        {pkg.ram > 0 && (
          <p className="mt-2 text-gray-600">{pkg.ram / 1024}GB RAM</p>
        )}
        {pkg.isAdmin && (
          <p className="mt-2 text-gray-600">Full Admin Access</p>
        )}
        <div className="mt-4 flex items-baseline">
          <span className="text-2xl font-bold text-indigo-600">Rp{pkg.price.toLocaleString()}</span>
        </div>
        <button
          onClick={onOrder}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default PackageCard;