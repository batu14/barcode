import React, { useState, useEffect } from 'react';
import Container from '../../Components/Container';
import { Chart } from "react-google-charts";
import { FaChartPie, FaChartBar, FaMoneyBillWave, FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineBarChart } from "react-icons/md";

const StatCard = ({ icon, title, desc, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center min-h-[420px] relative overflow-hidden">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-indigo-500 text-2xl">{icon}</span>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {desc && <p className="text-sm text-gray-500 mb-4 text-center">{desc}</p>}
    <div className="w-full flex-1 flex items-center justify-center">{children}</div>
  </div>
);

const Loader = () => (
  <div className="flex flex-col items-center justify-center w-full h-72">
    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
    <span className="text-gray-400 text-sm">Yükleniyor...</span>
  </div>
);

const isPieDataValid = (data) =>
  Array.isArray(data) && data.length > 0 && data.some(item => item.kar && item.title);

const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num;
};

const convertDataForChart = (data) => {
  const chartData = [["Ürün", "Kâr"]];
  data.forEach(item => chartData.push([item.title, Number(item.kar) || 0]));
  return chartData;
};

function convertToBarChartData(data) {
  const chartData = [['Ay', 'İade', 'Satış', 'Zaiyat']];
  data.forEach((item, index) => {
    const { ıade, satıs, zaıat } = item[0] || {};
    chartData.push([`Ay ${index + 1}`, ıade || 0, satıs || 0, zaıat || 0]);
  });
  return chartData;
}
function convertToBarChartData2(data) {
  const chartData = [['Ay', 'Kâr', 'Satış', 'Maliyet']];
  data.forEach((item, index) => {
    const { kar, satıs, maliyet } = item[0] || {};
    chartData.push([`Ay ${index + 1}`, kar || 0, satıs || 0, maliyet || 0]);
  });
  return chartData;
}

const Statistics = () => {
  const [max, setMax] = useState([]);
  const [min, setMin] = useState([]);
  const [_float, setFloat] = useState([]);
  const [_kar, setKar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchAll = async () => {
      try {
        const fetchData = async (action, extra = {}) => {
          const formdata = new FormData();
          formdata.append('action', action);
          if (extra.date) formdata.append('date', extra.date);
          const res = await fetch(process.env.REACT_APP_BASE_URL + 'statistics.php', {
            method: 'POST',
            body: formdata
          });
          return res.json();
        };
        const year = new Date().getFullYear();
        const [maxData, minData, floatData, karData] = await Promise.all([
          fetchData('max'),
          fetchData('min'),
          fetchData('float', { date: year }),
          fetchData('kar', { date: year }),
        ]);
        setMax(maxData);
        setMin(minData);
        setFloat(floatData);
        setKar(karData);
        console.log("maxData", maxData);
        console.log("minData", minData);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <Container padding>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <StatCard
          icon={<FaChartPie />}
          title="En Karlı 10 Ürün"
          desc="Kâra göre en iyi 10 ürünün dağılımı"
        >
          {loading ? <Loader /> : !isPieDataValid(max) ? (
            <div className="text-gray-400 text-center w-full">Veri bulunamadı</div>
          ) : (
            <Chart
              chartType="PieChart"
              data={convertDataForChart(max)}
              options={{
                legend: { position: "bottom" },
                chartArea: { width: "90%", height: "80%" },
                pieSliceText: "value",
                slices: { 0: { color: "#6366f1" }, 1: { color: "#818cf8" } }
              }}
              width={"100%"}
              height={"300px"}
            />
          )}
        </StatCard>
        <StatCard
          icon={<FaChartPie className="rotate-180" />}
          title="En Karsız 10 Ürün"
          desc="Kâra göre en düşük 10 ürünün dağılımı"
        >
          {loading ? <Loader /> : !isPieDataValid(min) ? (
            <div className="text-gray-400 text-center w-full">Veri bulunamadı</div>
          ) : (
            <Chart
              chartType="PieChart"
              data={convertDataForChart(min)}
              options={{
                legend: { position: "bottom" },
                chartArea: { width: "90%", height: "80%" },
                animation: { duration: 1000, easing: "out", startup: true },
                pieSliceText: "value",
                slices: { 0: { color: "#f87171" }, 1: { color: "#fbbf24" } }
              }}
              width={"100%"}
              height={"300px"}
            />
          )}
        </StatCard>
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          icon={<MdOutlineBarChart />}
          title="Aylık İşlem Sayıları"
          desc="Her ay yapılan satış, iade ve zaiyat işlemleri"
        >
          {loading ? <Loader /> : (
            <Chart
              chartType="Bar"
              width="100%"
              height="300px"
              data={convertToBarChartData(_float)}
              options={{
                legend: { position: "bottom" },
                chartArea: { width: "80%", height: "70%" },
                vAxis: { minValue: 0 },
                animation: { duration: 300, easing: 'out', startup: true },
                colors: ["#6366f1", "#22c55e", "#f87171"]
              }}
            />
          )}
        </StatCard>
        <StatCard
          icon={<FaArrowTrendUp />}
          title="Kâr, Satış ve Maliyet"
          desc="Aylık toplam kâr, satış ve maliyet karşılaştırması"
        >
          {loading ? <Loader /> : (
            <Chart
              chartType="Bar"
              width="100%"
              height="300px"
              data={convertToBarChartData2(_kar)}
              options={{
                legend: { position: "bottom" },
                chartArea: { width: "80%", height: "70%" },
                hAxis: {
                  title: 'Toplam',
                  minValue: 0,
                  format: 'decimal',
                },
                bars: 'horizontal',
                bar: { groupWidth: '75%' },
                colors: ["#6366f1", "#22c55e", "#fbbf24"]
              }}
            />
          )}
        </StatCard>
      </div>
    </Container>
  );
};

export default Statistics;