import React from 'react'
import { useState, useEffect } from 'react'
import Container from '../../Components/Container'
import toast, { Toaster } from 'react-hot-toast';
import { FaSearch } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { FaBoxOpen, FaMoneyBillWave, FaPercentage, FaWarehouse } from "react-icons/fa";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";

const İmportHistory = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [data, setData] = useState([])
    const [barcode, setBarcode] = useState(window.localStorage.getItem('selectedProduct') || '')
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(null)
    const [salesData, setSalesData] = useState([])
    const [purchasesData, setPurchasesData] = useState([])
    const [salesStats, setSalesStats] = useState({})
    const [purchaseStats, setPurchaseStats] = useState({})
    const [currentStock, setCurrentStock] = useState(0)
    const [totalAvarageSale, setTotalAvarageSale] = useState()

    useEffect(() => {
        if (date) {
            fetchData()
        }
    }, [date]);

    const fetchData = () => {
        const formdata = new FormData()
        formdata.append('action', 'select')
        formdata.append('date', date)
        fetch(process.env.REACT_APP_BASE_URL + 'storeHistory.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (data.status != 200) {
                    toast.error('Veri bulunamadı');
                } else {
                    setData(data.data)
                }
            })
            .catch(e => {
                toast.error('Bir hata oluştu');
                console.error(e);
            })
    }

    const fetchBarcode = () => {
        if (!barcode) {
            toast.error('Lütfen bir barkod giriniz')
            return
        }

        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'selectWithBarcode')
        formdata.append('barcode', barcode || '0001')

        fetch(process.env.REACT_APP_BASE_URL + 'storeHistory.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.status != 200) {
                    toast.error(data.message || 'Veri bulunamadı');
                } else {
                    // API'den gelen verileri state'lere aktar
                    setProduct(data.product)
                    setSalesData(data.totalSales || [])
                    setPurchasesData(data.purchases || [])
                    setSalesStats(data.salesStats || {})
                    setPurchaseStats(data.purchaseStats || {})
                    setCurrentStock(data.stock || 0)
                    setTotalAvarageSale(calculateStats(data.totalAvarageSale) || [])
                    toast.success('Ürün bilgileri yüklendi')
                }
            })
            .catch(e => {
                setLoading(false)
                toast.error('Bir hata oluştu');
                console.error(e);
            })
    }

    const keyHandel = (e) => {
        if (e.keyCode == 13 || e.key == 'Enter') {
            fetchBarcode()
        }
    }

    // Tarih formatlayıcı
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    }

    // Para birimi formatı
    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + '₺';
    }

    // Veriyi temizle
    const clearData = () => {
        setProduct(null)
        setSalesData([])
        setPurchasesData([])
        setSalesStats({})
        setPurchaseStats({})
        setCurrentStock(0)
        setBarcode('')
    }


    // totalAvarageSales hesaplama 
    const sumKeys = ['sale_count'];
    // Hangi alanların ortalamasını istiyorsak
    const avgKeys = [
        'product_count', 'product_price', 'product_cost',
        'sale_price', 'sale_cost',
        'total_product_cost', 'total_sale_cost'
    ];

    function calculateStats(data) {
        const result = {};
        const count = data.length;

        // Toplamları hesapla
        sumKeys.forEach(key => {
            result[`${key}`] = data.reduce((acc, item) => acc + parseFloat(item[key]), 0);
        });

        // Ortalamaları hesapla
        avgKeys.forEach(key => {
            const sum = data.reduce((acc, item) => acc + parseFloat(item[key]), 0);
            result[`${key}`] = sum / count;
        });

        return result;
    }

    return (
        <Container padding>
            <Toaster position='top-right'></Toaster>
            <div className='w-full flex flex-col items-center justify-end gap-2 mb-4'>
                <div className='w-full flex items-center justify-center gap-4'>
                    <input
                        value={barcode}
                        onKeyDown={keyHandel}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder='Barkod ile ara'
                        className='w-full border p-2 h-9 border-black rounded-md'
                        disabled={loading}
                    />
                    <button
                        onClick={fetchBarcode}
                        className='bg-green-400 flex items-center justify-center gap-1 text-white rounded-md px-6 p-2'
                        disabled={loading}
                    >
                        <FaSearch /> {loading ? 'Yükleniyor...' : 'Ara'}
                    </button>
                    {product && (
                        <button
                            onClick={clearData}
                            className='bg-indigo-600 flex items-center group justify-center gap-1 text-white rounded-md px-6 p-2'
                        >
                            <IoReload className='group-hover:animate-spin' /> Sıfırla
                        </button>
                    )}
                </div>
            </div>

            {product && (
                <div className='w-full flex flex-col gap-4'>
                    {/* Ürün Bilgileri ve Özet İstatistikler */}
                    <div className='w-full bg-white shadow-md rounded-lg overflow-hidden'>
                        <div className='bg-gray-100 p-4 border-b'>
                            <h2 className='text-xl font-bold'>Ürün Bilgileri</h2>
                        </div>
                        <div className='p-4'>
                            <div className='flex flex-col md:flex-row gap-6'>
                                {/* Ürün Resmi ve Temel Bilgiler */}
                                <div className='w-full md:w-1/3 flex flex-col'>
                                    <div className='bg-gray-50 p-4 rounded-lg mb-4 flex items-center justify-center'>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className='max-h-48 max-w-full object-contain'
                                        />
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <h3 className='text-lg font-bold mb-2'>{product.name}</h3>
                                        <p className='text-gray-700 mb-2'>Barkod: <span className='font-semibold'>{product.barcode}</span></p>
                                        <p className='text-gray-700 mb-2'>Güncel Fiyat: <span className='font-semibold'>{formatCurrency(product.price)}</span></p>
                                        <p className='text-gray-700 mb-2'>Mevcut Stok: <span className='font-semibold'>{currentStock} adet</span></p>
                                    </div>
                                </div>

                                {/* İstatistik Kartları */}
                                <div className='w-full md:w-2/3'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {/* Satın Alım İstatistikleri */}
                                        <div className='bg-blue-50 p-4 rounded-lg'>
                                            <h3 className='text-lg font-bold text-blue-800 flex items-center mb-4'>
                                                <FaBoxOpen className='mr-2' /> Satın Alım İstatistikleri
                                            </h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Toplam Alınan</p>
                                                    <p className='text-xl font-bold'>{totalAvarageSale.product_count || product.count} adet</p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Ortalama Alım Fiyatı</p>
                                                    <p className='text-xl font-bold'>{formatCurrency(totalAvarageSale.product_cost / totalAvarageSale.product_count || product.cost)}</p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Toplam Harcama</p>
                                                    <p className='text-xl font-bold'>{formatCurrency(totalAvarageSale.product_count * totalAvarageSale.product_cost || product.count * product.cost)}</p>
                                                </div>

                                            </div>
                                        </div>

                                        {/* Satış İstatistikleri */}
                                        <div className='bg-green-50 p-4 rounded-lg'>
                                            <h3 className='text-lg font-bold text-green-800 flex items-center mb-4'>
                                                <FaMoneyBillWave className='mr-2' /> Satış İstatistikleri
                                            </h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Toplam Satılan</p>
                                                    <p className='text-xl font-bold'>{totalAvarageSale.sale_count || 0} adet</p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Ortalama Satış Fiyatı</p>
                                                    <p className='text-xl font-bold'>{formatCurrency(totalAvarageSale.sale_price || 0)}</p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Toplam Gelir</p>
                                                    <p className='text-xl font-bold'>{formatCurrency(totalAvarageSale.sale_price * totalAvarageSale.sale_count || 0)}</p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg shadow-sm'>
                                                    <p className='text-sm text-gray-500'>Kâr Marjı</p>
                                                    <p className='text-xl font-bold text-green-600 flex items-center'>
                                                        <FaPercentage className='mr-1' /> {parseFloat(((totalAvarageSale.sale_price - totalAvarageSale.product_cost) / totalAvarageSale.sale_price) * 100).toFixed(2) || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Satın Alım ve Satış Verileri Tabloları */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Satın Alım Geçmişi */}
                        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                            <div className='bg-blue-50 p-4 border-b'>
                                <h3 className='text-lg font-bold text-blue-800 flex items-center'>
                                    <FaBoxOpen className='mr-2' /> Satın Alım Geçmişi
                                </h3>
                            </div>
                            <div className='p-4'>
                                {purchasesData.length > 0 ? (
                                    <div className='overflow-x-auto max-h-80 overflow-y-auto'>
                                        <table className='w-full border-collapse'>
                                            <thead className='sticky top-0 bg-white'>
                                                <tr className='bg-gray-100'>
                                                    <th className='p-2 text-left'>Tarih</th>
                                                    <th className='p-2 text-right'>Adet</th>
                                                    <th className='p-2 text-right'>Birim Fiyat</th>
                                                    <th className='p-2 text-right'>Toplam</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {purchasesData.map((item, index) => (
                                                    <tr key={index} className='border-b hover:bg-gray-50'>
                                                        <td className='p-2'>{item.date}</td>
                                                        <td className='p-2 text-right'>{item.count}</td>
                                                        <td className='p-2 text-right'>{formatCurrency(item.cost)}</td>
                                                        <td className='p-2 text-right font-semibold'>{formatCurrency(item.cost * item.count)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className='text-gray-500 italic p-4 text-center'>Satın alım verisi bulunamadı.</p>
                                )}
                            </div>
                        </div>

                        {/* Satış Geçmişi */}
                        <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                            <div className='bg-green-50 p-4 border-b'>
                                <h3 className='text-lg font-bold text-green-800 flex items-center'>
                                    <FaMoneyBillWave className='mr-2' /> Satış Geçmişi
                                </h3>
                            </div>
                            <div className='p-4'>
                                {salesData.length > 0 ? (
                                    <div className='overflow-x-auto max-h-80 overflow-y-auto'>
                                        <table className='w-full border-collapse'>
                                            <thead className='sticky top-0 bg-white'>
                                                <tr className='bg-gray-100'>
                                                    <th className='p-2 text-left'>Tarih</th>
                                                    <th className='p-2 text-right'>Adet</th>
                                                    <th className='p-2 text-right'>Satış Fiyatı</th>
                                                    <th className='p-2 text-right'>Maliyet</th>
                                                    <th className='p-2 text-right'>Kâr</th>
                                                    <th className='p-2 text-right'>İşem Türü</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesData.map((item, index) => (
                                                    <tr key={index} className='border-b hover:bg-gray-50'>
                                                        <td className='p-2'>{item.date}</td>
                                                        <td className='p-2 text-right'>{item.count}</td>
                                                        <td className='p-2 text-right'>{item.price}</td>
                                                        <td className='p-2 text-right'>{formatCurrency(item.cost)}</td>
                                                        <td className='p-2 text-right font-semibold text-green-600'>
                                                            {(Number(item.price) - Number(item.cost)) * Number(item.count)}
                                                        </td>
                                                        <td className='p-2 text-right'>
                                                            {
                                                                item.type == 1 && <p className='bg-green-500 text-center p-2 rounded-md text-white'>Satış</p>
                                                            }
                                                            {
                                                                item.type == 0 && <p className='bg-indigo-500 text-center p-2 rounded-md text-white'>İade</p>
                                                            }
                                                            {
                                                                item.type == 2 && <p className='bg-red-500 text-center p-2 rounded-md text-white'>Zaiat</p>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className='text-gray-500 italic p-4 text-center'>Satış verisi bulunamadı.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!product && !loading && (
                <div className='bg-gray-50 rounded-lg p-8 text-center my-8 w-full'>
                    <FaSearch className='text-gray-400 text-4xl mx-auto mb-4' />
                    <h3 className='text-xl font-semibold text-gray-700 mb-2'>Ürün verilerini görüntülemek için barkod numarası girin</h3>
                    <p className='text-gray-500'>Ürün hakkında tüm satın alım, satış ve stok bilgilerini görüntüleyebilirsiniz.</p>
                </div>
            )}

            {loading && (
                <div className='flex w-full items-center justify-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                </div>
            )}
        </Container>
    )
}

export default İmportHistory