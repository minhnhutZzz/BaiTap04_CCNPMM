import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';

const Home = () => {
  const [promoProducts, setPromoProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API lấy trà sữa khuyến mãi
        const promoRes = await productService.getProducts({ is_promotion: true });
        // Gọi API lấy trà sữa mới
        const newRes = await productService.getProducts({ is_new: true });

        if (promoRes.success) setPromoProducts(promoRes.data);
        if (newRes.success) setNewProducts(newRes.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={product.thumbnail || 'https://via.placeholder.com/150'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_promotion && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Khuyến mãi
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.Category?.name}</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            {product.discount_price ? (
              <>
                <span className="text-red-600 font-bold text-lg">{product.discount_price.toLocaleString('vi-VN')} đ</span>
                <span className="text-gray-400 line-through text-sm ml-2">{product.price.toLocaleString('vi-VN')} đ</span>
              </>
            ) : (
              <span className="text-indigo-600 font-bold text-lg">{product.price.toLocaleString('vi-VN')} đ</span>
            )}
          </div>
          <span className="text-xs text-gray-500">Đã bán: {product.sold}</span>
        </div>
        {/* Nút xem chi tiết (sẽ cập nhật link sau khi làm trang chi tiết) */}
        <Link to={`/user/products/${product.id}`} className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl p-8 mb-12 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Bobatea - Trà Sữa Ngon Nhất!</h1>
        <p className="text-lg opacity-90">Khám phá ngay các hương vị độc quyền chỉ có tại cửa hàng chúng tôi.</p>
      </div>

      {/* Khuyến mãi */}
      {promoProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            🔥 Đang Khuyến Mãi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promoProducts.map(renderProductCard)}
          </div>
        </section>
      )}

      {/* Mới nhất */}
      {newProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            ✨ Trà Sữa Mới Ra Mắt
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map(renderProductCard)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
