import React from "react";
import Container from "../../Components/Container";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import {
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiPieChart,
} from "react-icons/fi";
import { IoMdTrendingDown } from "react-icons/io";

const Panel = () => {
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [count, setCount] = useState([]);
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [amount, setAmount] = useState();
  const [type, setType] = useState();
  const [totalCost, setTotalCost] = useState();
  const [retur, setReturn] = useState(0);
  const [returCost, setReturnCost] = useState(0);

  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("action", "select");
    formdata.append("date", new Date().toLocaleDateString());
    fetch(process.env.REACT_APP_BASE_URL + "panel.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 400) {
          setData(data);
          setPrice(JSON.parse(data["price"]).price);
          setReturn(JSON.parse(data["r"]).price);
          setCost(JSON.parse(data["cost"]).cost);
          setTotalCost(JSON.parse(data["totalCost"]).totalCost);
          setList(JSON.parse(data["m"]));
          setReturnCost(JSON.parse(data["totalReturnCost"]).r);

          // setDailyCount(data.reduce((acc, curr) => acc + curr.red, 0));
        }
      });

    const selectcount = new FormData();
    selectcount.append("action", "selectCount");
    fetch(process.env.REACT_APP_BASE_URL + "panel.php", {
      method: "POST",
      body: selectcount,
    })
      .then((res) => res.json())
      .then((data) => {
        setCount(data["store"]);
        setCats(data["cat"]);
      });

      const dailyCount = new FormData()
        dailyCount.append('action', 'selectDay')
        dailyCount.append('date', new Date().toLocaleDateString())
        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
          method: 'POST',
          body: dailyCount
        }).then(res => res.json())
        .then(data => {
          setDailyCount(data.reduce((acc, curr) => acc + Number(curr.count), 0));
        })
  }, []);

  const toggleHandeler = (e) => {
    e.preventDefault();
    if (e.target.classList.contains("close")) {
      setOpen(false);
    }
  };

  const listHandel = () => {
    if (!amount || !type) {
      toast.error("Bir tip veya miktar giriniz");
    }
    const start = new Date().toLocaleDateString();
    setList([
      ...list,
      {
        type: type,
        amount: amount,
        date: start,
      },
    ]);
  };

  const sendList = () => {
    const start = new Date().toLocaleDateString();
    const formdata = new FormData();
    formdata.append("action", "insert");
    formdata.append(
      "data",
      JSON.stringify({
        type: type,
        text: text,
        amount: amount,
        date: start,
      })
    );
    fetch(process.env.REACT_APP_BASE_URL + "panel.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 200) {
          toast.error(data.message);
        } else {
          setList([
            ...list,
            {
              type: type,
              text: text,
              amount: amount,
              date: start,
            },
          ]);

          toast.success(data.message);
        }
      });
  };

  const deleteList = (item) => {
    const formdata = new FormData();
    formdata.append("action", "deleteList");
    formdata.append("id", item.id);
    fetch(process.env.REACT_APP_BASE_URL + "panel.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 200) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          setList(list.filter((i) => i.id != item.id));
        }
      });
  };

  const linkHandel = (p1, p2) => {
    var fullUrl =
      "details/" +
      "?c=" +
      encodeURIComponent(p1) +
      "&s=" +
      encodeURIComponent(p2);
    window.location.href = fullUrl;
  };

  return (
    <Container>
      <Toaster position="top-center" />

      {/* Gider Ekleme Modal */}
      {open && (
        <div
          onClick={(e) => toggleHandeler(e)}
          className="fixed close z-50 w-full h-screen bg-black/70 backdrop-blur-sm top-0 left-0 flex items-center justify-center p-4"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Yeni Gider Ekle
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tutar
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FiDollarSign size={16} />
                    </span>
                    <input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tür
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value={0}>Tür Seçiniz</option>
                    <option value="Günlük">Günlük</option>
                    <option value="Aylık">Aylık</option>
                    <option value="Personel">Personel</option>
                    <option value="Faturalar">Faturalar</option>
                    <option value="Mültarif">Mültarif</option>
                    <option value="Vergi">Vergi</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Açıklama
                </label>
                <textarea
                  id="text"
                  placeholder="Açıklama giriniz..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  rows="2"
                />
              </div>

              <button
                onClick={sendList}
                disabled={!amount || !text || type === 0}
                className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  !amount || !text || type === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <FiPlus size={18} />
                Gider Ekle
              </button>
            </div>

            {list.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">
                  Son Eklenen Giderler
                </h3>
                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                  {list.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            item.type === "Günlük"
                              ? "bg-blue-100 text-blue-600"
                              : item.type === "Personel"
                              ? "bg-purple-100 text-purple-600"
                              : item.type === "Faturalar"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.type === "Günlük" && <FiCalendar size={18} />}
                          {item.type === "Personel" && (
                            <FiTrendingUp size={18} />
                          )}
                          {item.type === "Faturalar" && (
                            <FiDollarSign size={18} />
                          )}
                          {!["Günlük", "Personel", "Faturalar"].includes(
                            item.type
                          ) && <FiPieChart size={18} />}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {item.text}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-gray-900">
                          {item.amount} TL
                        </p>
                        <button
                          onClick={() => deleteList(item)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full mx-auto px-4 py-8">
        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Link
            to="/dashboard/daily"
            className="bg-white rounded-xl shadow-xl hover:shadow-md p-4 transition-all flex items-center gap-4 overflow-hidden relative group"
          >
            <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiPackage size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Günlük Satış Adeti
              </p>
              <p className="text-2xl font-bold text-gray-900">{dailyCount && dailyCount}</p>
            </div>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all">
              <FiArrowUpRight size={18} className="text-indigo-500" />
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-xl hover:shadow-md p-4 transition-all">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3">
              <FiTrendingUp size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Günlük Kazanç</p>
            <p className="text-2xl font-bold text-gray-900">
              {price != null ? parseInt(price - retur).toFixed(1) : 0} TL
            </p>
            <p className="text-xs text-green-600 mt-1"></p>
          </div>

          <div className="bg-white rounded-xl shadow-xl hover:shadow-md p-4 transition-all">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-3">
              <IoMdTrendingDown size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Günlük Maliyet</p>
            <p className="text-2xl font-bold text-gray-900">
              {parseInt(cost - returCost)} TL
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl hover:shadow-md p-4 transition-all">
            <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-3">
              <FiDollarSign size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Günlük Kar</p>
            <p className="text-2xl font-bold text-gray-900">
              {parseInt(price - cost - (retur - returCost)).toFixed(1)} TL
            </p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((price - cost - (retur - returCost)) / (price - retur)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div
            onClick={() => setOpen(true)}
            className="bg-white rounded-xl shadow-xl hover:shadow-md p-4 cursor-pointer transition-all"
          >
            <div className="h-12 w-12 bg-red-800 text-white rounded-lg flex items-center justify-center mb-3">
              <IoMdTrendingDown size={24} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Günlük Gider</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalCost == null ? "0" : totalCost} TL
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
              <FiPlus size={12} />
              <span>Yeni gider ekle</span>
            </div>
          </div>
        </div>

        {/* Stok Bilgileri */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Stok Adetleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {count &&
              count.map((subArray, index) =>
                subArray.map((item, subIndex) =>
                  item.total != null ? (
                    <div
                      key={`${index}-${subIndex}`}
                      className="bg-white rounded-xl shadow-xl hover:shadow-md p-4 transition-all overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 capitalize">
                          {item.store}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-orange-100 text-orange-800 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold">{item.total}</p>
                          <p className="text-xs">Toplam Adet</p>
                        </div>

                        <div className="bg-red-100 text-red-800 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold">{Number(item.cost).toFixed(2)} TL</p>
                          <p className="text-xs">Maliyet</p>
                        </div>

                        <div className="bg-green-100 text-green-800 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold">{Number(item.price).toFixed(2)} TL</p>
                          <p className="text-xs">Satış</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {cats &&
                          cats.map((catItem, catIndex) => {
                            const catData = catItem[0];
                            return (
                              <button
                                key={catIndex}
                                onClick={() =>
                                  linkHandel(catData.store, item.store)
                                }
                                className="w-full p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-sm font-medium">
                                      Kategori: {catData.store}
                                    </span>
                                    <p className="text-xs text-left text-indigo-700">
                                      {catData.total}: adet
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium">
                                      {Number(catData.price).toFixed(1)} TL
                                    </span>
                                    <p className="text-xs text-indigo-700">
                                      Maliyet: {Number(catData.cost).toFixed(1)}{" "}
                                      TL
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ) : null
                )
              )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Panel;
