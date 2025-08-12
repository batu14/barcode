import React from "react";
import { Link } from "react-router-dom";
import { 
  FaTrash, 
  FaBarcode, 
  FaBox, 
  FaTag, 
  FaHashtag,
  FaEdit,
  FaUndo,
  FaInfoCircle,
  FaCheck
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const role = window.localStorage.getItem("role");
  const navigate = useNavigate();

  const deleteHandler = (id) => {
    const formdata = new FormData();
    formdata.append("action", "delete");
    formdata.append("id", id);
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 400) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  const restoreHandler = (id) => {
    const formdata = new FormData();
    formdata.append("action", "restore");
    formdata.append("id", id);
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 400) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  const deleteItem = (id) => {
    const formdata = new FormData();
    formdata.append("action", "permaDelete");
    formdata.append("id", id);
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const navigateHandel = () => {
    // /dashboard/barcode
    const b = item.barcode;
    navigate("/dashboard/barcode", { state: item });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <Toaster position="top-right" />

      {/* Ürün Görseli */}
      <div className="relative group">
        <img
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400"
          }}
          src={item.image ?? "https://placehold.co/600x400"}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          alt={item.name}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4 space-y-4">
        {/* Başlık ve Temel Bilgiler */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h1 className="text-lg font-semibold text-gray-800 capitalize line-clamp-2">
              {item.name}
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              {item.price} ₺
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FaHashtag className="text-gray-400" size={12} />
              <span>{item.barcode}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaBox className="text-gray-400" size={12} />
              <span>{item.count} adet</span>
            </div>
          </div>
        </div>

        {/* Durum ve Stok Bilgisi */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                item.status !== 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {item.status !== 0 ? "Aktif" : "Pasif"}
            </span>
          </div>
          <div
            className={`text-sm font-medium ${
              item.count > 1 ? "text-green-600" : "text-orange-600"
            }`}
          >
            {item.count > 1 ? "Stok Yeterli" : "Stok Az"}
          </div>
        </div>

        {/* Butonlar */}
        <div className="grid grid-cols-2 gap-2">
          {/* Ana İşlem Butonları */}
          <Link
            to={`/dashboard/updateProduct/${item.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <FaEdit size={14} />
            <span className="text-sm font-medium">Düzenle</span>
          </Link>

          {item.status !== 0 ? (
            <button
              onClick={() => deleteHandler(item.id)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaTrash size={14} />
              <span className="text-sm font-medium">Sil</span>
            </button>
          ) : (
            <button
              onClick={() => restoreHandler(item.id)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <FaUndo size={14} />
              <span className="text-sm font-medium">Geri Yükle</span>
            </button>
          )}
        </div>

        {/* İkincil İşlem Butonları */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={navigateHandel}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaBarcode size={14} />
            <span className="text-sm font-medium">Barkod</span>
          </button>

          <button
            onClick={() => {
              window.localStorage.setItem("selectedProduct", item.barcode);
              navigate("/dashboard/storehistory");
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaInfoCircle size={14} />
            <span className="text-sm font-medium">Detaylar</span>
          </button>
        </div>

        {/* Kalıcı Silme Butonu */}
        {item.status === 0 && (
          <button
            onClick={() => deleteItem(item.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash size={14} />
            <span className="text-sm font-medium">Kalıcı Olarak Sil</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
