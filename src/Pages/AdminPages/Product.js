import Container from "../../Components/Container";
import ProductCard from "../../Components/ProductCard";
import { Link } from "react-router-dom";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Switch } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import { BarcodeScanner, useTorch } from "react-barcode-scanner";
import {
  FaCamera,
  FaPlus,
  FaFilter,
  FaSearch,
  FaBarcode,
  FaTimes,
  FaTrash,
  FaBox,
  FaLayerGroup,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MultiRangeSlider from "multi-range-slider-react";

const Product = () => {
  const [items, setItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [deleteItem, setDeleteItem] = useState(false);
  const [barcode, setBarcode] = useState(null);
  const [name, setName] = useState(null);
  const [isSupportTorch, , onTorchSwitch] = useTorch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const navigate = useNavigate();
  const filterContainer = useRef();
  const [minValue, set_minValue] = useState(1);
  const [maxValue, set_maxValue] = useState(100000);
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [categories, setCategories] = useState([]);

  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const fetchData = () => {
    const formdata = new FormData();
    formdata.append("action", "selectWithPage");
    formdata.append("page", page);
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        setItems([...items, ...data]);
      });

    const formdata2 = new FormData();
    formdata2.append("action", "select");

    fetch(process.env.REACT_APP_BASE_URL + "categories.php", {
      method: "POST",
      body: formdata2,
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch(() => toast.error("Veriler yüklenirken bir hata oluştu"))
      .finally(() => setLoading(false));
  };
  const lastCarElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    window.localStorage.setItem("count", 1);
    fetchData();
    const formdata2 = new FormData();
    formdata2.append("action", "selectDeleted");
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata2,
    })
      .then((res) => res.json())
      .then((data) => {
        setDeletedItems(data);
      });
  }, []);

  const linkHandel = () => {
    window.localStorage.setItem("count", 30);
    navigate("/dashboard/addProduct");
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const options = {
    formats: [
      "ean_13",
      "code_128",
      "code_39",
      "code_93",
      "codabar",
      "ean_8",
      "itf",
      "qr_code",
      "upc_a",
      "upc_e",
    ],
  };

  const onCapture = (detected) => {
    if (detected) {
      const formdata = new FormData();
      formdata.append("action", "findByBarcode");
      formdata.append("barcode", detected.rawValue);
      fetch(process.env.REACT_APP_BASE_URL + "product.php", {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status != 404) {
            setItems([data.data]);
            setOpen(false);
          } else {
            alert("Ürün bulunamadı");
          }
        });
    }
  };

  const filterByname = () => {
    const formdata = new FormData();
    formdata.append("action", "findByName");
    formdata.append("name", name == null ? "a" : name);
    formdata.append("min", minValue);
    formdata.append("max", maxValue);
    formdata.append("category", category);
    formdata.append("stockStatus", stockStatus);
    formdata.append("sortBy", stockStatus);
    formdata.append("sortOrder", sortOrder);
    formdata.append("startDate", startDate);
    formdata.append("endDate", endDate);
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 200) {
          toast.error(data.message);
        } else {
          setItems(data.data);
          filterHandel();
        }
      });
  };

  const deleteAll = () => {
    const formdata = new FormData();
    formdata.append("action", "deletePermaAll");
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 200) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      })
      .finally()
      .catch((e) => console.error(e));
  };

  const filterHandel = () => {
    filterContainer.current.classList.toggle("hidden");
  };

  const keyHandel = (e) => {
    if (e.key === "Enter") {
      const formdata = new FormData();
      formdata.append("action", "findByBarcode");
      formdata.append("barcode", barcode);
      fetch(process.env.REACT_APP_BASE_URL + "product.php", {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status != 404) {
            setItems([data.data, ...items]);
          } else {
            toast.error(data.message);
          }
        });
    }
  };

  const resetFilters = () => {
    setName(null);
    set_minValue(1);
    set_maxValue(100000);
    setCategory("");
    setStockStatus("all");
    setSortBy("name");
    setSortOrder("asc");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Container>
      <Toaster position="top-right" />

      <div className="w-full flex items-center justify-around gap-3 px-4">
        <div className="w-full flex items-start justify-center flex-col gap-3">
          <div className="flex items-center gap-3">
            <FaBox className="text-indigo-600" size={24} />
            <h1 className="text-xl font-semibold text-gray-800">
              {!deleteItem ? "Ürünler" : "Silinen Ürünler"}
            </h1>
          </div>
          <span className="text-gray-500">
            Toplam {!deleteItem ? items.length : deletedItems.length} ürün
          </span>
        </div>

        <div className="w-full flex items-end justify-center gap-3 flex-col">
          <span className="w-full flex items-center justify-end gap-2">
            <span className="text-gray-500">Silinenleri Göster</span>
            <Switch
              checked={deleteItem}
              onChange={setDeleteItem}
              className={`${
                deleteItem ? "bg-indigo-400" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  deleteItem ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </span>
          <span className="w-full flex items-center justify-end gap-4">
            {deleteItem && (
              <button
                onClick={deleteAll}
                className="w-full bg-red-600 whitespace-nowrap text-white rounded-md px-4 py-2"
              >
                Hepsini Sil
              </button>
            )}
            <button
              onClick={linkHandel}
              className="bg-indigo-300 whitespace-nowrap text-indigo-600 px-4 py-2 rounded-md"
            >
              30X
            </button>
            <Link
              to="/dashboard/addProduct"
              className="bg-indigo-300 whitespace-nowrap text-indigo-600 px-4 py-2 rounded-md"
            >
              Ürün Ekle
            </Link>
          </span>
        </div>
      </div>

      <div className="w-full flex items-center gap-2 justify-between mt-6 px-4">
        <div className="w-full relative">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={keyHandel}
            placeholder="Barkod giriniz"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
          <FaBarcode
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
        <button
          onClick={filterHandel}
          className="bg-green-500 flex items-center gap-2 px-4 py-2 text-white rounded-lg"
        >
          <FaFilter size={14} />
          <span>Filtrele</span>
        </button>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-500 flex items-center gap-2 px-4 py-2 text-white rounded-lg"
        >
          <FaCamera size={14} />
          <span>Kamera</span>
        </button>
      </div>

      {/* Filtre Modal */}
      <div
        ref={filterContainer}
        className="fixed hidden left-0 top-0 w-full h-screen bg-black/50 z-50 transition-opacity duration-300"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md transform transition-all duration-300">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Filtreleme
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ürünleri filtrelemek için seçenekleri kullanın
                </p>
              </div>
              <button
                onClick={filterHandel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Adı
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ürün adı giriniz"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <FaSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sırala
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tümü</option>
                  <option value="name">Adına Göre</option>
                  <option value="price">Fiyata Göre</option>
                  <option value="stock">Stok Miktarına Göre</option>
                  <option value="cost">Maliyetine Göre</option>
                  <option value="date">Tarihe Göre</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Fiyat Aralığı
                  </label>
                  <span className="text-sm text-indigo-600 font-medium">
                    {minValue.toLocaleString("tr-TR")} ₺ -{" "}
                    {maxValue.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <MultiRangeSlider
                  min={0}
                  max={50000}
                  step={1000}
                  minValue={minValue}
                  maxValue={maxValue}
                  onInput={handleInput}
                  className="!border-none !shadow-none"
                  barInnerColor="rgb(99, 102, 241)"
                  ruler={false}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={resetFilters}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash size={14} />
                <span>Filtreleri Sıfırla</span>
              </button>
              <button
                onClick={filterByname}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaFilter size={14} />
                <span>Filtrele</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kamera Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <BarcodeScanner options={options} onCapture={onCapture} />
            <div className="flex items-center gap-2 mt-4">
              {isSupportTorch && (
                <button
                  onClick={onTorchSwitch}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg"
                >
                  El Feneri
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ürün Listesi */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 px-4">
        {(deleteItem ? deletedItems : items).map((item, index) => (
          <ProductCard key={index + item.barcode} item={item} />
        ))}
      </div>
      <span ref={lastCarElementRef} />
    </Container>
  );
};

export default Product;
