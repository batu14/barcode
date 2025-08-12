import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import { FiPrinter } from "react-icons/fi";
import { FaSave } from "react-icons/fa";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';






const ReportPage = () => {
    const location = useLocation();
    const [calc, setCalc] = useState([])
    const [counts, setCounts] = useState([])
    const [basket, setBasket] = useState()
    const [date, setDate] = useState()
    const [cost, setCost] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(location.state)
        setCalc(location.state.calc)
        setCounts(location.state.counts)
        setBasket(location.state.basket)
        setDate(location.state.date)
        setCost(location.state.costs)

    }, [])


    const saveHandel = () => {

        setLoading(true); // Yükleniyor mesajını göster
        const input = document.getElementById('pdf-content');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pdf = new jsPDF('p', 'mm', 'a4');
            let position = 0;
            let heightLeft = imgHeight;

            const imgData = canvas.toDataURL('image/png');

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= 297;
                if (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                }
            }

            pdf.save(`${Object.values(date)}.pdf`);
            setLoading(false); // Yükleniyor mesajını gizle
        });
    };
    return (

        <>
            {loading && (
                <div className="fixed inset-0 bg-gray-800/75 flex justify-center items-center z-50">
                    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-xl">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-gray-700 mt-4 text-lg font-medium">Rapor hazırlanıyor...</p>
                    </div>
                </div>
            )}
            <Document id='pdf-content' className='p-8 max-w-[1200px] mx-auto'>
                <Page size="A4" className='space-y-8'>
                    <View className='flex justify-between items-center p-4 bg-white rounded-lg shadow'>
                        <span className='flex gap-4 print:hidden'>
                            <button 
                                onClick={() => window.print()} 
                                className='bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-colors'
                            >
                                <FiPrinter className="text-xl" />
                                Yazdır
                            </button>
                            <button 
                                onClick={saveHandel} 
                                className='bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-colors'
                            >
                                <FaSave className="text-xl" />
                                Kaydet
                            </button>
                        </span>
                        <Text className='text-lg font-medium text-gray-700'>
                            Tarih: {date && Object.values(date)}
                        </Text>
                    </View>

                    <View className='bg-white rounded-lg shadow overflow-hidden'>
                        {calc.map((item, index) => (
                            <View key={index} className='divide-y divide-gray-200'>
                                <View className='grid grid-cols-5 bg-gray-50'>
                                    {Object.keys(item).map((key, idx) => (
                                        <Text key={idx} className='p-4 text-lg font-semibold text-gray-700 text-center border-r last:border-r-0'>
                                            {key}
                                        </Text>
                                    ))}
                                </View>
                                <View className='grid grid-cols-5'>
                                    {Object.values(item).map((value, idx) => (
                                        <Text key={idx} className='p-4 text-lg text-gray-600 text-center border-r last:border-r-0'>
                                            {parseInt(value).toFixed(2)} TL
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                    <View className='bg-white rounded-lg shadow overflow-hidden'>
                        {counts.map((item, index) => (
                            <View key={index} className='divide-y divide-gray-200'>
                                <View className='grid grid-cols-3 bg-gray-50'>
                                    {Object.keys(item).map((key, idx) => (
                                        <Text key={idx} className='p-4 text-lg font-semibold text-gray-700 text-center border-r last:border-r-0'>
                                            {key}
                                        </Text>
                                    ))}
                                </View>
                                <View className='grid grid-cols-3'>
                                    {Object.values(item).map((value, idx) => (
                                        <View key={idx} className='p-4 text-center border-r last:border-r-0'>
                                            <div className='space-y-2'>
                                                {Object.entries(value).map(([k, v], i) => (
                                                    <div key={i} className='flex justify-between items-center'>
                                                        <span className='text-gray-600 font-medium'>{k}:</span>
                                                        <span className='text-gray-800'>{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                    {cost.length > 0 && (
                        <View className='bg-white rounded-lg shadow overflow-hidden'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Ürün</th>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Tür</th>
                                        <th className='px-6 py-4 text-right text-base font-semibold text-gray-700'>Tutar</th>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Tarih</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {cost.map((item, index) => (
                                        <tr key={index}>
                                            {Object.values(item).map((value, idx) => (
                                                value !== 'NaN' && (
                                                    <td key={idx} className={`px-6 py-4 text-base text-gray-600 ${
                                                        idx === 2 ? 'text-right' : 'text-left'
                                                    }`}>
                                                        {idx === 2 ? `${value} TL` : value}
                                                    </td>
                                                )
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </View>
                    )}

                    {basket && (
                        <View className='bg-white rounded-lg shadow overflow-hidden'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Ürün</th>
                                        <th className='px-6 py-4 text-center text-base font-semibold text-gray-700'>Adet</th>
                                        <th className='px-6 py-4 text-right text-base font-semibold text-gray-700'>Tutar</th>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Tarih</th>
                                        <th className='px-6 py-4 text-center text-base font-semibold text-gray-700'>Saat</th>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Kullanıcı</th>
                                        <th className='px-6 py-4 text-left text-base font-semibold text-gray-700'>Kategori</th>
                                        <th className='px-6 py-4 text-center text-base font-semibold text-gray-700'>ID</th>
                                        <th className='px-6 py-4 text-right text-base font-semibold text-gray-700'>Fiyat</th>
                                        <th className='px-6 py-4 text-right text-base font-semibold text-gray-700'>Maliyet</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {basket.map((item, index) => (
                                        <tr key={index} className='hover:bg-gray-50'>
                                            {Object.values(item).map((value, idx) => (
                                                console.log(value),
                                                value !== 'NaN' && (
                                                    <td key={idx} className={`px-6 py-4 text-base text-gray-600 ${
                                                        [2, 8, 9].includes(idx) ? 'text-right' : 
                                                        [1, 4, 7].includes(idx) ? 'text-center' : 'text-left'
                                                    }`}>
                                                        {[2, 8, 9].includes(idx) ? `${value} TL` : value}
                                                    </td>
                                                )
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </View>
                    )}
                </Page>
            </Document>
        </>


    )
}

export default ReportPage