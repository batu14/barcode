import React, { useEffect } from "react";
import { useState } from "react";
import Container from "../../Components/Container";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { Chart } from "react-google-charts";

const Report = () => {
  const [day, setDay] = useState(false);
  const [days, setDays] = useState([]);
  const [data, setData] = useState([]);
  const [cat, setCat] = useState([]);
  const [selectedCat, setSelectedCat] = useState();
  const [store, setStore] = useState([]);
  const [selectedStore, setSelectedStore] = useState([]);
  const [price, setPrice] = useState(0);
  const [maliyet, setMaliyet] = useState(0);
  const [selectedType, setSelectedType] = useState();
  const [selectedMount, setSelectedMount] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sales, setSales] = useState([]);
  const [retur, setReturn] = useState(0);
  const [z, setZ] = useState(0);
  const [costs, setCosts] = useState([]);
  const navigate = useNavigate();

  const [totalR, settotalR] = useState([]);
  const [totalZ, settotalz] = useState([]);
  const [totalG, settotalG] = useState();

  const [detailS, setDeatilS] = useState(0);
  const [detailR, setDeatilR] = useState(0);
  const [detailZ, setDeatilZ] = useState(0);
  const [detailP, setDeatilP] = useState(0);
  const [detailC, setDeatilC] = useState(0);

  const startYear = 1900;
  const endYear = new Date().getFullYear();
  const years = [];

  const groupSalesData = (data) => {
    const groupedData = data.reduce((acc, sale) => {
      const { name, count, price, date, time, user, category, id, cost } = sale;
      if (!acc[name]) {
        acc[name] = {
          name,
          totalQuantity: 0,
          totalPrice: 0,
          date,
          time,
          user,
          category,
          id,
          price,
          cost,
        };
      }
      acc[name].totalQuantity += parseInt(count, 10);
      acc[name].totalPrice += parseInt(price, 10) * parseInt(count, 10);
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const types = [
    { name: "Satış", value: 1 },
    { name: "İade", value: 0 },
    { name: "Zayiyat", value: 2 },
  ];

  const mounts = [
    { name: "Ocak", value: 1 },
    { name: "Şubat", value: 2 },
    { name: "Mart", value: 3 },
    { name: "Nisan", value: 4 },
    { name: "Mayıs", value: 5 },
    { name: "Haziran", value: 6 },
    { name: "Temmuz", value: 7 },
    { name: "Ağustos", value: 8 },
    { name: "Eylül", value: 9 },
    { name: "Ekim", value: 10 },
    { name: "Kasım", value: 11 },
    { name: "Aralık", value: 12 },
  ];

  useEffect(() => {
    const selectCat = new FormData();
    selectCat.append("action", "select");
    fetch(process.env.REACT_APP_BASE_URL + "categories.php", {
      method: "POST",
      body: selectCat,
    })
      .then((res) => res.json())
      .then((data) => {
        setCat(data);
      });

    const selectStore = new FormData();
    selectStore.append("action", "select");
    fetch(process.env.REACT_APP_BASE_URL + "store.php", {
      method: "POST",
      body: selectStore,
    })
      .then((res) => res.json())
      .then((data) => {
        setStore(data);
      });
  }, []);

  const columns = [
    {
      name: "No",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Kategori",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "İsim",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Tarih",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Fiyat",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Maliyet",
      selector: (row) => row.cost,
      sortable: true,
    },
  ];

  const selectMoundfunc = (e, value) => {
    setSelectedMount(value);

    const formdata = new FormData();
    formdata.append("action", "selectByMount");
    formdata.append("mount", value);
    formdata.append("date", selectedYear);
    fetch(process.env.REACT_APP_BASE_URL + "report.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setPrice(data.reduce((acc, item) => acc + item.price * item.count, 0));
        setMaliyet(
          data.reduce(
            (acc, item) => acc + Number(item.cost) * Number(item.count),
            0
          )
        );

        setSales(data.filter((item) => item.type == 1).length);
        setReturn(data.filter((item) => item.type == 0).length);
        setZ(data.filter((item) => item.type == 2).length);

        const r = data.filter((item) => item.type == 0);
        const z = data.filter((item) => item.type == 2);

        settotalR(
          r.reduce(
            (acc, item) => acc + Number(item.price) * Number(item.count),
            0
          )
        );
        settotalz(
          z.reduce(
            (acc, item) => acc + Number(item.price) * Number(item.count),
            0
          )
        );
      });

    const selectCost = new FormData();
    selectCost.append("action", "selectCost");
    selectCost.append("date", selectedYear);
    selectCost.append("mount", value);
    fetch(process.env.REACT_APP_BASE_URL + "panel.php", {
      method: "POST",
      body: selectCost,
    })
      .then((res) => res.json())
      .then((data) => {
        setCosts(data);

        settotalG(data.reduce((acc, item) => acc + Number(item.amount), 0));
      });

    const selectDailyReport = new FormData();
    selectDailyReport.append("action", "days");
    selectDailyReport.append("mount", value);
    selectDailyReport.append("date", selectedYear);
    fetch(process.env.REACT_APP_BASE_URL + "report.php", {
      method: "POST",
      body: selectDailyReport,
    })
      .then((res) => res.json())
      .then((data) => {
        setDays(data);
      });
  };

  const detailSearch = () => {
    const formdata = new FormData();
    formdata.append("action", "detailSearch");
    formdata.append("mount", selectedMount);
    formdata.append("date", selectedYear);
    formdata.append("categories", selectedCat);
    formdata.append("store", selectedStore);
    formdata.append("type", selectedType);
    fetch(process.env.REACT_APP_BASE_URL + "report.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setDeatilP(
          data.reduce((acc, item) => acc + item.price * item.count, 0)
        );
        setDeatilC(
          data.reduce(
            (acc, item) => acc + Number(item.cost) * Number(item.count),
            0
          )
        );

        setDeatilS(data.filter((item) => item.type == 1).length);
        setDeatilR(data.filter((item) => item.type == 0).length);
        setDeatilZ(data.filter((item) => item.type == 2).length);
      });
  };

  const reportHandel = () => {
    navigate("/dashboard/reportPage", {
      state: {
        calc: [
          {
            Satış: price,
            Maliyet: maliyet,
            Kar: price - maliyet,
            Gider: totalG,
            "Net kazanç": price - maliyet - totalG,
          },
        ],
        counts: [
          {
            Satış: {
              Tutar: parseInt(price).toFixed(2),
              Adet: sales,
            },
            İade: {
              Tutar: parseInt(totalR).toFixed(2),
              Adet: retur,
            },
            Zaiat: {
              Tutar: parseInt(totalZ).toFixed(2),
              Adet: z,
            },
          },
        ],
        basket: groupSalesData(data),
        date: {
          date:
            day != false
              ? day
              : 0 + "." + String(selectedMount) + "." + String(selectedYear),
        },
        costs: costs,
      },
    });
  };

  const getDayDetails = (day) => {
    setDay(day);
    const formdata = new FormData();
    formdata.append("action", "selectDayDetails");
    formdata.append("date", day);
    fetch(process.env.REACT_APP_BASE_URL + "report.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        setData(groupSalesData(data));

        setPrice(data.reduce((acc, item) => acc + item.price * item.count, 0));
        setMaliyet(
          data.reduce(
            (acc, item) => acc + Number(item.cost) * Number(item.count),
            0
          )
        );

        setSales(data.filter((item) => item.type == 1).length);
        setReturn(data.filter((item) => item.type == 0).length);
        setZ(data.filter((item) => item.type == 2).length);

        const r = data.filter((item) => item.type == 0);
        const z = data.filter((item) => item.type == 2);

        settotalR(
          r.reduce(
            (acc, item) => acc + Number(item.price) * Number(item.count),
            0
          )
        );
        settotalz(
          z.reduce(
            (acc, item) => acc + Number(item.price) * Number(item.count),
            0
          )
        );
      });

    const selectCost = new FormData();
    selectCost.append("action", "selectCostDaily");
    selectCost.append("date", day);
    fetch(process.env.REACT_APP_BASE_URL + "panel.php", {
      method: "POST",
      body: selectCost,
    })
      .then((res) => res.json())
      .then((data) => {
        setCosts(data);
        settotalG(data.reduce((acc, item) => acc + Number(item.amount), 0));
      });
  };

  return (
    <Container padding>
      {/* Header */}
      <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
        <div className="flex w-full flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Satış Raporları
          </h1>
          <div className="flex w-full items-center gap-4">
            <select
              value={selectedYear}
              onChange={handleChange}
              className="px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              onClick={reportHandel}
              className="px-6 flex-1 flex items-center justify-center py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-base font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Rapor Oluştur
            </button>
          </div>
        </div>
      </div>

      {/* Ay Seçimi */}
      <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 py-5 mb-4">
        <div className="flex items-center flex-nowrap justify-start overflow-x-scroll gap-3">
          {mounts.map((item) => (
            <button
              key={item.value}
              onClick={(e) => selectMoundfunc(e, item.value)}
              className={`px-4 py-2.5 text-base font-medium rounded-lg transition-colors min-w-[100px] ${
                selectedMount === item.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Günler Grid */}
      {days.length > 0 && (
        <div className="bg-white hidden md:block w-full rounded-lg shadow-sm border border-gray-200 p-5 mb-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {days.map((item, index) => {
              const dayValue = Object.values(item)[0];
              return (
                <button
                  key={index}
                  onClick={() => getDayDetails(String(dayValue))}
                  className={`p-3 flex text-sm lg:text-base justify-center items-center font-medium rounded-lg transition-colors ${
                    day === String(dayValue)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {dayValue}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white md:hidden  w-full rounded-lg shadow-sm border border-gray-200 mb-4">
        <details className="group w-full">
          <summary className="p-4 cursor-pointer list-none flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Gün Raporu</h2>
          </summary>
          <div className="grid grid-cols-3 md:hidden p-4 gap-4">
            {days.map((item, index) => {
              const dayValue = Object.values(item)[0];
              return (
                <button
                  key={index}
                  onClick={() => getDayDetails(String(dayValue))}
                  className={`p-3 flex text-sm lg:text-base justify-center items-center font-medium rounded-lg transition-colors ${
                    day === String(dayValue)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {dayValue}
                </button>
              );
            })}
          </div>
        </details>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Toplam Satış"
          value={`${parseInt(price).toFixed(2)} TL`}
          color="indigo"
        />
        <StatCard
          title="Toplam Kar"
          value={`${parseInt(price - maliyet).toFixed(2)} TL`}
          color="green"
        />
        <StatCard
          title="Toplam Maliyet"
          value={`${parseInt(maliyet).toFixed(2)} TL`}
          color="blue"
        />
        <StatCard
          title="Net Kazanç"
          value={`${parseInt(
            price - maliyet - totalR - totalZ - totalG
          ).toFixed(2)} TL`}
          color="purple"
        />
      </div>

      {/* İşlem Kartları */}
      <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-4 mb-4">
        <TransactionCard
          title="Satışlar"
          count={sales}
          amount={parseInt(price).toFixed(2)}
          color="green"
        />
        <TransactionCard
          title="İadeler"
          count={retur}
          amount={parseInt(totalR).toFixed(2)}
          color="yellow"
        />
        <TransactionCard
          title="Zayiat"
          count={z}
          amount={parseInt(totalZ).toFixed(2)}
          color="red"
        />
      </div>

      {/* Giderler Tablosu */}
      {costs.length > 0 && (
        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Giderler</h2>
            <span className="text-base font-medium text-gray-600">
              Toplam: {totalG} TL
            </span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Sno
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Tür
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase">
                    Tutar
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Tarih
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Açıklama
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {costs.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-base text-gray-600 whitespace-nowrap">
                      {Object.values(item)[0]}
                    </td>
                    <td className="px-4 py-3 text-base text-gray-600">
                      {Object.values(item)[1]}
                    </td>
                    <td className="px-4 py-3 text-base text-gray-600 text-right">
                      {Object.values(item)[2]} TL
                    </td>
                    <td className="px-4 py-3 text-base text-gray-600 whitespace-nowrap">
                      {Object.values(item)[3]}
                    </td>
                    <td className="px-4 py-3 text-base text-gray-600 whitespace-nowrap">
                      {Object.values(item)[4]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detaylı Arama */}
      <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 mb-4">
        <details className="group w-full">
          <summary className="p-4 cursor-pointer list-none flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Detaylı Arama</h2>
            <svg
              className="w-5 h-5 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Depo
                </label>
                <select
                  value={selectedStore}
                  multiple={false}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value={0}>Depo Seçiniz</option>
                  {store.map((store, index) => (
                    <option key={index} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedStore != 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={selectedCat}
                      multiple={false}
                      onChange={(e) => setSelectedCat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option>Kategori Seçiniz</option>
                      {cat.map((category, index) => (
                        <option key={index} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tür
                    </label>
                    <select
                      value={selectedType}
                      multiple={false}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value={-1}>Tür Seçiniz</option>
                      {types.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {selectedStore != 0 && (
              <button
                onClick={detailSearch}
                className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Ara
              </button>
            )}

            {/* Detaylı Arama Sonuçları */}
            {(detailS > 0 || detailR > 0 || detailZ > 0) && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Satış Tutarı"
                  value={`${parseInt(detailP).toFixed(2)} TL`}
                  subValue={`${detailS} Adet`}
                  color="green"
                />
                <StatCard
                  title="İade Tutarı"
                  value={`${parseInt(detailR).toFixed(2)} TL`}
                  subValue={`${detailR} Adet`}
                  color="yellow"
                />
                <StatCard
                  title="Zayiat Tutarı"
                  value={`${parseInt(detailZ).toFixed(2)} TL`}
                  subValue={`${detailZ} Adet`}
                  color="red"
                />
              </div>
            )}
          </div>
        </details>
      </div>

      {/* Sonuçlar Tablosu */}
      <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={groupSalesData(data)}
          pagination
          customStyles={{
            table: {
              style: {
                backgroundColor: "white",
                borderRadius: "0.5rem",
              },
            },
            headRow: {
              style: {
                backgroundColor: "#f8fafc",
                borderBottomWidth: "1px",
                borderBottomColor: "#e2e8f0",
              },
            },
            headCells: {
              style: {
                color: "#64748b",
                fontSize: "1rem",
                fontWeight: "600",
                padding: "1rem",
              },
            },
            cells: {
              style: {
                fontSize: "1rem",
                padding: "1rem",
                color: "#4b5563",
              },
            },
          }}
        />
      </div>
    </Container>
  );
};

// Yardımcı Bileşenler
const StatCard = ({ title, value, subValue, color }) => (
  <div className={`bg-${color}-50 rounded-lg p-5 border border-${color}-100`}>
    <h3 className="text-base font-medium text-gray-700 mb-3">{title}</h3>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    {subValue && (
      <p className={`text-base text-${color}-500 mt-2`}>{subValue}</p>
    )}
  </div>
);

const TransactionCard = ({ title, count, amount, color }) => (
  <div className={`bg-${color}-50 rounded-lg p-5 border border-${color}-100`}>
    <h3 className={`text-lg font-medium text-${color}-900 mb-4`}>{title}</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-base text-gray-600">Adet:</span>
        <span className="text-base font-medium">{count}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-base text-gray-600">Tutar:</span>
        <span className="text-base font-medium">{amount} TL</span>
      </div>
    </div>
  </div>
);

export default Report;
