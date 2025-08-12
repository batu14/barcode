import React, { useRef, useEffect, useState } from 'react'
import Container from '../../Components/Container'
import {  FaPrint, FaMoneyBill, FaUser, FaPhone, FaCalendar, FaReceipt } from "react-icons/fa6";
import { FaSearch,FaTimes,FaCheck } from "react-icons/fa";

import toast, { Toaster } from 'react-hot-toast';

const Ticks = () => {

    const [data, setData] = useState([])
    const [modal, setModal] = useState(false)
    const [balance, setBalance] = useState(0)
    const [total, setTotal] = useState(0)
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const barcodeRef = useRef()

    useEffect(() => {

        const formdata = new FormData()
        formdata.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL + 'tick.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data[0])
            })



    }, [])

    const takeHandel = (item) => {
        setModal(true)
        setBalance(item.balance)
        setId(item.sno)


    }


    const fetchHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'update')
        formdata.append('sno', id)
        formdata.append('balance', balance - total)
        formdata.append('date', new Date().toLocaleDateString())
        fetch(process.env.REACT_APP_BASE_URL + 'tick.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (data.status != 400) {
                    toast.success(data.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                } else {
                    toast.error(data.message)
                }
            })
    }

    const modalHandel = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('close')) {
            setModal(false)
        }
    }


    const filterHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'find')
        formdata.append('name', name)
        fetch(process.env.REACT_APP_BASE_URL + 'tick.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                setData([data])
            })
    }

    const handlePrint = (item) => {


        const printContents = `
        <table>
        <thead>
        <tr>
        <td>
        <a style='font-size:8px; font-weight:light;'>Ad Soyad</a>
        </td>
        <td>
        <a style='font-size:8px; font-weight:light;'>Kalan Tutar</a>
        </td>
        <td>
        <a style='font-size:8px; font-weight:light;'>Son Ödeme Tarihi</a>
        </td>
        </tr>
        </thead>
        <tbody>
         <tr>
        <td>
        <a style='font-size:8px; font-weight:light;'>${item.name + ' ' + item.surname}</a>
        </td>
        <td>
        <a style='font-size:8px; font-weight:light;'>${item.balance} TL</a>
        </td>
        <td>
        <a style='font-size:8px; font-weight:light;'>${item.lastDate}</a>
        </td>
        </tr>
        </tbody>
        </table>
        
        
        
        `




        // Yeni bir pencere açıyoruz ve sadece barcode içeriğini yazdırıyoruz
        const printWindow = window.open('')
        printWindow.document.write('<html><head><title>Barcode</title>');
        // Yazdırma için özel stil ekliyoruz
        printWindow.document.write(`<style>
            @page {
                size: 58mm 40mm;
                margin: 0;
            }


            table{
                border-collapse:collapse;
                border:1px solid black;
                
            }
            table tr td {
                border:1px solid black ;
                padding:2px;
            }
            body {
                margin: 0;
                padding: 0;
                width: 58mm;
                height: 40mm;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
            }
            .label {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
            .barcode {
                width: 100%;
                height: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .details {
                width: 100%;
                height: 25%;
                display: flex;
                justify-content: space-between;
                padding: 0 5mm;
                box-sizing: border-box;
                font-size: 12px;
            }
            .name {
                text-align: center;
                fonst-weight:light;
            }
            .name {
                text-align: left;
            }
            .price {
                font-weight:bold;
                text-align: right;
            }
        </style>`);
        printWindow.document.write("</head><body>");
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <Container>
            <Toaster position="top-right" />
            
            {/* Başlık ve Arama */}
            <div className="w-full mx-auto space-y-6 px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FaUser className="text-green-600" />
                            Veresiye Müşteriler
                        </h1>
                        <p className="text-sm text-gray-500">
                            Veresiye müşteri listesi ve ödemeleri
                        </p>
                    </div>
                    
                    {/* Arama Kutusu */}
                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Müşteri ara..."
                                className="w-64 pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FaSearch size={14} />
                            </div>
                        </div>
                        <button
                            onClick={filterHandel}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                        >
                            <FaSearch size={14} />
                            <span>Ara</span>
                        </button>
                    </div>
                </div>

                {/* Müşteri Tablosu */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-sm text-gray-600">
                                    <th className="px-4 py-3 text-left font-medium">Müşteri Bilgileri</th>
                                    <th className="px-4 py-3 text-left font-medium">İletişim</th>
                                    <th className="px-4 py-3 text-left font-medium">Tarihler</th>
                                    <th className="px-4 py-3 text-right font-medium">Tutarlar</th>
                                    <th className="px-4 py-3 text-center font-medium">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.map((item) => (
                                    <tr key={item.sno} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <FaUser size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {item.name} {item.surname}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        #{item.sno}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaPhone size={14} />
                                                <span>{item.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FaCalendar size={14} />
                                                    <span>İşlem: {item.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-orange-600">
                                                    <FaCalendar size={14} />
                                                    <span>Son Ödeme: {item.lastDate}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-right space-y-1">
                                                <div className="text-gray-600">
                                                    Toplam: <span className="font-medium">{item.total} ₺</span>
                                                </div>
                                                <div className="text-green-600">
                                                    İndirim: <span className="font-medium">{item.discount} ₺</span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-800">
                                                    {item.balance} ₺
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => takeHandel(item)}
                                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                                                    title="Ödeme Al"
                                                >
                                                    <FaMoneyBill size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handlePrint(item)}
                                                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                                                    title="Fiş Yazdır"
                                                >
                                                    <FaReceipt size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Ödeme Alma Modalı */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FaMoneyBill className="text-green-600" />
                                Ödeme Al
                            </h2>
                            <button 
                                onClick={() => setModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ödeme Tutarı
                                </label>
                                <input
                                    type="number"
                                    value={total}
                                    onChange={(e) => setTotal(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Mevcut Bakiye:</span>
                                    <span className="font-medium text-gray-800">{balance} ₺</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-gray-600">Kalan Bakiye:</span>
                                    <span className="font-bold text-green-600">{balance - total} ₺</span>
                                </div>
                            </div>

                            <button
                                onClick={fetchHandel}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <FaCheck size={14} />
                                <span>Ödemeyi Tamamla</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Ticks;