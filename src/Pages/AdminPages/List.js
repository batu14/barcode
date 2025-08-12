import React, { useEffect, useState } from 'react'
import Container from '../../Components/Container'
import toast, { Toaster } from 'react-hot-toast'
import { FaCalendar, FaShoppingBasket, FaTrash, FaBarcode, FaClock } from 'react-icons/fa'

const List = () => {
    const [data, setData] = useState([])
    const D = new Date()
    const [date, setDate] = useState(D.toLocaleDateString())

    const fetchData = (selectedDate) => {
        const formdata = new FormData()
        formdata.append('action', 'selectList')
        formdata.append('date', selectedDate)
        
        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
            method: 'POST',
            body: formdata
        })
        .then(res => res.json())
        .then(data => {
            setData(data[0] || [])
        })
        .catch(error => {
            toast.error('Veri yüklenirken bir hata oluştu')
        })
    }

    const deleteHandel = (sno) => {
        toast.promise(
            new Promise((resolve, reject) => {
                const formdata = new FormData()
                formdata.append('action', 'deleteList')
                formdata.append('sno', sno)
                
                fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
                    method: 'POST',
                    body: formdata
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 200) {
                        resolve(data)
                        fetchData(date)
                    } else {
                        reject(new Error(data.message))
                    }
                })
                .catch(reject)
            }),
            {
                loading: 'Siliniyor...',
                success: 'Başarıyla silindi',
                error: 'Silme işlemi başarısız'
            }
        )
    }

    useEffect(() => {
        fetchData(date)
    }, [date])

    return (
        <Container>
            <Toaster position="top-right" />
            
            {/* Başlık ve Tarih Seçici */}
            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <FaShoppingBasket className="text-indigo-600" size={24} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Alınacaklar Listesi</h1>
                            <p className="text-sm text-gray-500">Alınması gereken ürünlerin listesi</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-gray-500">
                            <FaCalendar size={16} />
                            <span className="text-sm">{date}</span>
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Masaüstü Görünümü */}
            <div className="hidden w-full lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barkod</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data && data.map((item) => (
                                <tr key={item.sno} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sno}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={item.img} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.barcode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => deleteHandel(item.sno)}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <FaTrash size={14} />
                                            <span>Sil</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobil Görünüm */}
            <div className="lg:hidden w-full space-y-4">
                {data && data.map((item) => (
                    <div key={item.sno} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative aspect-video">
                            <img
                                src={item.img}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 space-y-3">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaBarcode className="text-gray-400" />
                                <span>{item.barcode}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaClock className="text-gray-400" />
                                <span>{item.date}</span>
                            </div>

                            <button
                                onClick={() => deleteHandel(item.sno)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FaTrash size={14} />
                                <span>Sil</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Boş Durum */}
            {(!data || data.length === 0) && (
                <div className="text-center w-full py-12">
                    <FaShoppingBasket className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">Liste Boş</h3>
                    <p className="mt-2 text-sm text-gray-500">Henüz alınacak ürün eklenmemiş</p>
                </div>
            )}
        </Container>
    )
}

export default List