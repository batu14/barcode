import React, { useRef, useState, useEffect } from 'react'
import Container from '../../Components/Container'
import { FaDiceFive, FaPrint, FaBarcode, FaBox } from "react-icons/fa6";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import Barcode from 'react-barcode';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Bar = () => {
    const barcodeRef = useRef(null);
    const [price, setPrice] = useState(0);
    const [barcode, setBarcode] = useState(0);
    const location = useLocation();
    const [name, setName] = useState('');
    const [count, setCount] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBarcode(location.state ? location.state.barcode : 0);
        setName(location.state ? location.state.name : '');
        setPrice(location.state ? location.state.price : 0);
        setCount(location.state ? location.state.count : 0);
    }, [location]);

    const randomBarcode = () => {
        setLoading(true);
        let number = Math.floor(Math.random() * 9999999999);
        const formdata = new FormData();
        formdata.append('action', 'chechBarcode');
        formdata.append('barcode', number);
        
        fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
            method: 'POST',
            body: formdata
        })
        .then(res => res.json())
        .then(data => {
            if (data.status != 200) {
                toast.error(data.message);
            } else {
                setBarcode(data.barcode);
                toast.success('Yeni barkod oluşturuldu');
            }
        })
        .finally(() => setLoading(false));
    };

    const handlePrint = () => {
        const printContents = barcodeRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        // Yeni bir pencere açıyoruz ve sadece barcode içeriğini yazdırıyoruz
        const printWindow = window.open('')
        printWindow.document.write('<html><head><title>Barcode</title>');
        // Yazdırma için özel stil ekliyoruz
        printWindow.document.write(`<style>
            @page {
                size: 58mm 40mm;
                margin: 0;
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
                position:relative;
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
                position:absolute;
                top:-30;
            }
            .details {
                width: 100%;
                height: 25%;
                display: flex;
                align-items:center;
                justify-content: space-between;
                padding: 0 5mm;
                box-sizing: border-box;
                font-size: 12px;

                
            }
            .name {
               text-align: center;
                font-weight:light;
            }
            
                
            
            .price {
               font-size:1.3rem;
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

    const keyHandel = (e) => {
        if (e.keyCode === 13) {
            setLoading(true);
            const formdata = new FormData();
            formdata.append('action', 'findByBarcode');
            formdata.append('barcode', e.target.value);
            
            fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 404) {
                    toast.error(data.message);
                    setBarcode(barcode);
                    setPrice(0);
                    setName('');
                } else {
                    setBarcode(data.data.barcode);
                    setPrice(data.data.price);
                    setName(data.data.name);
                    setCount(data.data.count);
                    toast.success('Ürün bulundu');
                }
            })
            .finally(() => setLoading(false));
        }
    };

    return (
        <Container>
            <Toaster position="top-right" />
            
            <div className="w-full mx-auto space-y-6 px-4">
                {/* Başlık */}
                <div className="flex items-center gap-2 mb-6">
                    <FaBarcode className="text-indigo-600" size={24} />
                    <h1 className="text-xl font-semibold text-gray-800">
                        Barkod Oluşturucu
                    </h1>
                </div>

                {/* Kontrol Paneli */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="space-y-4">
                        {/* Barkod Arama */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    onKeyDown={keyHandel}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    value={barcode}
                                    placeholder="Barkod numarası giriniz veya arayınız"
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FaSearch size={16} />
                                </div>
                            </div>
                            <button
                                onClick={randomBarcode}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:bg-gray-300"
                            >
                                <FaDiceFive size={16} />
                                <span className="text-sm font-medium">Rastgele</span>
                            </button>
                        </div>

                        {/* Ürün Bilgileri */}
                        {count !== undefined && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg">
                                <FaBox size={16} />
                                <span className="text-sm">Stok Adedi: {count}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Barkod Önizleme */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col items-center justify-center min-h-[200px] relative">
                        {barcode ? (
                            <div ref={barcodeRef} className="label">
                                <div className="label">
                                    <Barcode
                                        value={barcode}
                                        className="barcode"
                                    />
                                    <div className="mt-4 text-center space-y-2">
                                        {name && (
                                            <p className="text-sm font-medium text-gray-800">
                                                {name}
                                            </p>
                                        )}
                                        {price > 0 && (
                                            <p className="text-lg font-bold text-indigo-600">
                                                {price} ₺
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                <FaInfoCircle size={24} />
                                <p className="text-sm">
                                    Barkod oluşturmak için numara girin veya rastgele oluşturun
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Yazdırma Butonu */}
                {barcode > 0 && (
                    <div className="flex justify-center">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                        >
                            <FaPrint size={16} />
                            <span className="font-medium">Barkodu Yazdır</span>
                        </button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Bar;