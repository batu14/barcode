import Container from '../../Components/Container'
import { FaCamera, FaBarcode, FaChevronDown, FaCheck } from "react-icons/fa6";
import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import { BarcodeScanner, useTorch } from "react-barcode-scanner"
import "react-barcode-scanner/polyfill"
import SalesCard from '../../Components/SalesCard';
import toast, { Toaster } from 'react-hot-toast';

const Casualty = () => {



    const ref = React.useRef(null)
    const sellBtn = useRef(null)
    const [count, setCount] = useState(1)
    const [open, setOpen] = useState(false)
    const [modal, setModal] = useState(false)
    const [barcode, setBarcode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [basket, setBasket] = useState(window.localStorage.getItem('basket') ? JSON.parse(window.localStorage.getItem('basket')) : [])
    const [total, setTotal] = useState(1)
    const [isSupportTorch, , onTorchSwitch] = useTorch()
    const [alert, setAlert] = useState()
    const [list, setList] = useState([])

    const toggleHandeler = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('close')) {
            setOpen(false)
        }
    }
    const modalHandel = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('close')) {
            setModal(false)
        }
    }

    const sellHandel = () => {
        setModal(true)
    }

    const totalHandel = () => {

        let total = 0
        basket.map((item) => {
            total += item.price * item.count
        })
        return total


    }

    const fetchHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'casualty')
        formdata.append('total', totalHandel())
        formdata.append('discount', discount)
        formdata.append('user', window.localStorage.getItem('user') ? window.localStorage.getItem('user') : 'Anonim')
        formdata.append('date', new Date().toLocaleDateString())
        formdata.append('time', new Date().toLocaleTimeString())
        formdata.append('basket', JSON.stringify(basket))
        formdata.append('type', 2)


        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json()).then(data => {
            if (data.status != 400) {
                toast.success('Satış Başarılı')
                setAlert(data.alert)
                setBasket([])
                setModal(false)
                setTotal(0)
                setDiscount(0)
                setBarcode('')

            } else {
                toast.error('Satış Başarısız')
            }
        })

    }
    const onCapture = (detected) => {
        if (detected) {
            const formdata = new FormData()
            formdata.append('action', 'findByBarcode')
            formdata.append('barcode', detected.rawValue)
            fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json()).then(data => {
                if (data.status != 400) {
                    try {

                        const itemCount = basket.filter((item) => item.barcode === detected.rawValue).length
                        if (itemCount > 0) {
                            const index = basket.findIndex((item) => item.barcode === detected.rawValue)
                            if (count > 1) {
                                basket[index].count = basket[index].count + parseInt(count)
                                setTotal((prev) => prev + parseInt(basket[index].price) * parseInt(count))
                            } else {
                                basket[index].count += 1
                                setTotal((prev) => prev + parseInt(basket[index].price))
                            }
                            setBasket([...basket])
                            setOpen(false)
                            setBarcode(detected.rawValue)

                        } else {
                            const p = 1221
                            setBasket([...basket, {
                                image: data.data.image,
                                name: data.data.name,
                                cost: data.data.cost,
                                barcode,
                                count: count,
                                price: parseInt(data.data.price),
                                store: data.data.store,
                                category: data.data.category
                            }])
                            setTotal(total + p)



                        }

                        setOpen(false)

                        setBarcode(detected.rawValue)
                        ref.current.focus()
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    const role = window.localStorage.getItem('role')
                    if (role === 'admin') {
                        window.location.href = '/dashboard/addProduct'
                    } else {
                        toast.error('Ürün Bulunamadı')

                    }
                }
            })
        }


    }


    const keyHandel = (e) => {
        if (e.key === 'Enter') {
            const formdata = new FormData()
            formdata.append('action', 'findByBarcode')
            formdata.append('barcode', barcode)
            fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json()).then(data => {
                if (data.status != 404) {
                    const itemCount = basket.filter((item) => item.barcode === barcode).length
                    if (itemCount > 0) {
                        const index = basket.findIndex((item) => item.barcode === barcode)
                        if (count > 1) {
                            basket[index].count = basket[index].count + parseInt(count)
                            setTotal((prev) => prev + parseInt(basket[index].price) * parseInt(count))
                        } else {
                            basket[index].count += 1
                            setTotal((prev) => prev + parseInt(basket[index].price))
                        }
                        setBasket([...basket])
                        setOpen(false)
                    } else {
                        const p = parseInt(data.price)
                        setBasket([...basket, {
                            image: data.data.image,
                            name: data.data.name,
                            cost: data.data.cost,
                            barcode,
                            count: count,
                            price: parseInt(data.data.price),
                            store: data.data.store,
                            category: data.data.category
                        }])
                        setTotal(total + p)
                    }
                    setOpen(false)
                    setBarcode("")
                }
                else {
                    const role = window.localStorage.getItem('role')
                    if (role === 'admin') {
                        const c = window.confirm('Ürün Bulunamadı, Eklemek ister misiniz?')
                        if (c) {
                            window.location.href = '/dashboard/addProduct'
                        }

                    } else {
                        toast.error('Ürün Bulunamadı')

                    }
                }

            }
            )
        }

    }

    const clearBasket = () => {
        setBasket([])
        setBarcode('')
    }

    useEffect(() => {

        if (modal) {
            if (discount > totalHandel()) {
                toast.error('İndirim sepet tutarından fazla olamaz')
                sellBtn.current.classList.add('hidden')
            } else {
                sellBtn.current.classList.remove('hidden')
            }
        }


    }, [discount])

    useEffect(() => {
        window.localStorage.setItem('basket', JSON.stringify(basket))
    }, [basket])



    const options = {

        formats: [
            'ean_13',
            'code_128',
            'code_39',
            'code_93',
            'codabar',
            'ean_8',
            'itf',
            'qr_code',
            'upc_a',
            'upc_e',
        ]
    }





    useEffect(() => {
        const formdata = new FormData()
        formdata.append('action', 'list')
        fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                setList(data)
            })
    }, [])





    return (
        <Container>
            {
                alert != null ?
                    <div onClick={(e) => { e.target.remove() }} className='w-full p-4 lg:p-12  close h-screen bg-black/50 z-50 fixed top-0 left-0 flex items-center justify-center'>
                        <div className='bg-white p-4 text-red-500 text-2xl capitalize rounded-md flex flex-col'>
                            {
                                alert
                            }
                        </div>
                    </div> : null
            }
            <Toaster position='top-center'></Toaster>
            <div className="w-full mx-auto space-y-4 px-4">
                {/* Üst Kontrol Paneli */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-red-100">
                    {/* Başlık */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-red-600 mb-1">
                                <FaExclamationTriangle size={16} />
                                <h1 className="text-lg font-semibold">
                                    Fire/Zayi Kaydı
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500">
                                Zayi olmuş veya fire verilecek ürünleri kaydedin
                            </p>
                        </div>
                    </div>

                    {/* Barkod ve Kontroller */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-8 relative">
                                <input
                                    type="text"
                                    onKeyDown={keyHandel}
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    placeholder="Barkod giriniz"
                                    className="w-full pl-3 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FaBarcode size={16} />
                                </div>
                            </div>
                            <div className="md:col-span-4 flex gap-2">
                                <button
                                    onClick={() => setOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all"
                                >
                                    <FaCamera size={14} />
                                    <span>Kamera ile Oku</span>
                                </button>
                                {basket.length > 0 && (
                                    <button
                                        onClick={clearBasket}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hızlı Ürün Seçimi */}
                        <div className="relative">
                            <select
                                onChange={(e) => setBarcode(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none transition-all"
                            >
                                <option value="">Hızlı ürün seçiniz</option>
                                {list?.map((item) => (
                                    <option key={item.id} value={item.barcode}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <FaChevronDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ürün Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
                    {basket.map((item) => (
                        <SalesCard
                            key={item.barcode}
                            item={item}
                            func={setBasket}
                            value={basket}
                        />
                    ))}
                </div>

                {/* Alt Toplam Çubuğu */}
                {basket.length > 0 && (
                    <div className="fixed bottom-4 left-4 right-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-red-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                                    <div className="text-base font-medium text-gray-800">
                                        Toplam Fire/Zayi:{" "}
                                        <span className="text-red-600 font-bold">
                                            {totalHandel()} TL
                                        </span>
                                    </div>
                                    <button
                                        onClick={sellHandel}
                                        className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaCheck size={14} />
                                        <span>Fire/Zayi Kaydını Tamamla</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-red-600">
                                    <FaExclamationTriangle size={20} />
                                    <h2 className="text-lg font-semibold">
                                        Fire/Zayi Onayı
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {basket.map((item) => (
                                    <div key={item.barcode} className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.barcode}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {item.count} adet
                                        </p>
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-600">Toplam Fire/Zayi Tutarı:</span>
                                        <span className="text-lg font-bold text-red-600">
                                            {totalHandel()} TL
                                        </span>
                                    </div>

                                    <button
                                        ref={sellBtn}
                                        onClick={fetchHandel}
                                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaCheck size={14} />
                                        <span>Fire/Zayi Kaydını Onayla</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kamera Modalı */}
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4">
                            <div className="space-y-4">
                                <BarcodeScanner options={options} onCapture={onCapture} />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={count}
                                        onChange={(e) => setCount(e.target.value)}
                                        placeholder="Adet"
                                        className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    />
                                    {isSupportTorch && (
                                        <button
                                            onClick={onTorchSwitch}
                                            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm rounded-lg transition-all"
                                        >
                                            El Feneri
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default Casualty