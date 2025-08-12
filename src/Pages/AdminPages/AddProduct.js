import React, { useState, useRef, useCallback, useEffect } from 'react'
import Container from '../../Components/Container'
import { Tab } from '@headlessui/react'
import { BarcodeScanner, useTorch } from "react-barcode-scanner"
import { FaCamera, FaBarcode, FaBox, FaImage, FaInfoCircle, FaTimes } from "react-icons/fa"
import { BiSolidCameraOff } from "react-icons/bi"
import { FaTrash } from "react-icons/fa"
import { Switch } from '@headlessui/react'
import toast, { Toaster } from 'react-hot-toast'
import Webcam from "react-webcam"

const AddProduct = () => {
    const [barcode, setBarcode] = useState('')
    const [imageSrc, setImageSrc] = React.useState(null);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [height, setHeight] = useState('')
    const [width, setWidth] = useState('')
    const [length, setLength] = useState('')
    const [cost, setCost] = useState('')
    const [price, setPrice] = useState('')
    const [cameraOpen, setCameraOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [count, setCount] = useState(window.localStorage.getItem('count'))
    const [isSupportTorch, , onTorchSwitch] = useTorch()
    const [list, setList] = useState(false)
    const [date, setDate] = useState(new Date().toLocaleDateString())
    const [category, setCategory] = useState('')
    const [store, setStore] = useState('')
    const [appendDate, setAppenDate] = useState('')

    const [cat, setCat] = useState([])
    const [stores, setStores] = useState([])

    const webcamRef = useRef(null);

    const [open, setOpen] = useState(false)

    const nextStep = () => {
        const max = 2
        if (selectedIndex === max) return
        setSelectedIndex(selectedIndex + 1)
    }
    const prevStep = () => {
        if (selectedIndex === 0) return
        setSelectedIndex(selectedIndex - 1)
    }

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

    const onCapture = (detected) => {
        if (detected) {
            const formdata = new FormData()
            formdata.append('action', 'find')
            formdata.append('barcode', detected.rawValue)
            fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json()).then(data => {
                setName(data.name)
                setDescription(data.description)
                setHeight(data.height)
                setWidth(data.width)
                setLength(data.depth)
                setCost(data.cost)
                setPrice(data.price)
                setCategory(data.category)
                setStore(data.store)
                setCount(data.count)
                setImageSrc(data.image)
                setAppenDate(data.date)
            })

            setBarcode(detected.rawValue)
            setOpen(false)
        }
    }

    const toggleHandeler = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('close')) {
            setOpen(false)
        }
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrc(imageSrc);
    }, [webcamRef]);
    const videoConstraints = {
        facingMode: "environment"
    };

    const historyHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'create')
        formdata.append('date', date)
        formdata.append('name', name)
        formdata.append('count', count)
        formdata.append('barcode', barcode)
        formdata.append('cost', cost)

        fetch(process.env.REACT_APP_BASE_URL + 'storeHistory.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json()).then(data => {
            if (data.status != 200) {
                toast.error('Bir hata oldu')
            }
            else {
                // window.location.reöload()
            }
        }).catch(err => {
            console.log(err)
        }
        )
    }

    const sumbitHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'insert')
        formdata.append('name', name)
        formdata.append('description', description)
        formdata.append('height', height)
        formdata.append('width', width)
        formdata.append('depth', length)
        formdata.append('count', count)
        formdata.append('price', price)
        formdata.append('category', category)
        formdata.append('store', store)
        formdata.append('barcode', barcode)
        formdata.append('image', imageSrc ? imageSrc : 'https://placehold.co/600x400')
        formdata.append('cost', cost)
        formdata.append('list', list == true ? 1 : 0)
        formdata.append('date', date)

        fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json()).then(data => {
            if (data.status != 200) {
                toast.error('Bir hata oldu')
            }
            else {
                toast.success('Ürün eklendi')
                historyHandel()
            }
        }).catch(err => {
            console.log(err)
        }
        )
    }

    useEffect(() => {
        const categories = new FormData()
        categories.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL + 'categories.php', {
            method: 'POST',
            body: categories
        }).then(res => res.json()).then(data => {
            setCat(data)
        })

        const stores = new FormData()
        stores.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL + 'store.php', {
            method: 'POST',
            body: stores
        }).then(res => res.json()).then(data => {
            setStores(data)
        })
    }, [])

    const findHandel = (e) => {
        if (e.keyCode == '13') {
            const formdata = new FormData()
            formdata.append('action', 'find')
            formdata.append('barcode', barcode)
            fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json()).then(data => {
                setName(data.name)
                setDescription(data.description)
                setHeight(data.height)
                setWidth(data.width)
                setLength(data.depth)
                setCost(data.cost)
                setPrice(data.price)
                setCategory(data.category)
                setStore(data.store)
                setCount(data.count)
                setImageSrc(data.image)
                setAppenDate(data.date)
            })
        }
    }

    return (
        <Container padding>
            <Toaster position="top-right" />
            
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Ürün Ekle</h1>
                <p className="text-gray-600">Yeni ürün eklemek için formu doldurun</p>
            </div>

            <Tab.Group className={'w-full'} selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="flex space-x-4 p-1 bg-gray-100 rounded-xl mb-6">
                    <Tab className={({ selected }) =>
                        `flex items-center gap-2 w-full py-3 px-4 text-sm font-medium rounded-lg transition-all
                        ${selected 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                        }`
                    }>
                        <FaBarcode /> Barkod
                    </Tab>
                    <Tab className={({ selected }) =>
                        `flex items-center gap-2 w-full py-3 px-4 text-sm font-medium rounded-lg transition-all
                        ${selected 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                        }`
                    }>
                        <FaImage /> Fotoğraf
                    </Tab>
                    <Tab className={({ selected }) =>
                        `flex items-center gap-2 w-full py-3 px-4 text-sm font-medium rounded-lg transition-all
                        ${selected 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                        }`
                    }>
                        <FaInfoCircle /> Ürün Bilgileri
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    <Tab.Panel>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={barcode}
                                            onChange={(e) => setBarcode(e.target.value)}
                                            onKeyDown={findHandel}
                                            placeholder="Barkod numarası giriniz"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <FaBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                    <button
                                        onClick={() => setOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                                    >
                                        <FaCamera size={16} />
                                        <span>Tara</span>
                                    </button>
                                </div>

                                {imageSrc && (
                                    <div className="relative">
                                        <img src={imageSrc} alt="Ürün" className="w-full h-48 object-cover rounded-lg" />
                                        <button
                                            onClick={() => setImageSrc(null)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    İleri
                                </button>
                            </div>
                        </div>
                    </Tab.Panel>

                    <Tab.Panel>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            {!cameraOpen ? (
                                <button
                                    onClick={() => setCameraOpen(true)}
                                    className="w-full py-12 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-indigo-500 transition-all"
                                >
                                    <FaCamera size={32} className="text-gray-400" />
                                    <span className="text-gray-600">Kamera ile Fotoğraf Çek</span>
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/webp"
                                        screenshotQuality={0.3}
                                        videoConstraints={videoConstraints}
                                        className="w-full rounded-lg"
                                    />
                                    
                                    <div className="flex gap-3">
                                        <button
                                            onClick={capture}
                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaCamera size={16} />
                                            <span>Fotoğraf Çek</span>
                                        </button>
                                        <button
                                            onClick={() => setCameraOpen(false)}
                                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <BiSolidCameraOff size={16} />
                                            <span>Kamerayı Kapat</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {imageSrc && (
                                <div className="mt-4 relative">
                                    <img src={imageSrc} alt="Çekilen fotoğraf" className="w-full h-48 object-cover rounded-lg" />
                                    <button
                                        onClick={() => setImageSrc(null)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    İleri
                                </button>
                            </div>
                        </div>
                    </Tab.Panel>

                    <Tab.Panel>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="space-y-6">
                                {appendDate && (
                                    <div className="text-right text-sm text-gray-500">
                                        Eklenme tarihi: {appendDate}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Ürün adını giriniz"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Kategori Seçiniz</option>
                                            {cat.map((c, i) => (
                                                <option key={i} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Depo</label>
                                        <select
                                            value={store}
                                            onChange={(e) => setStore(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Depo Seçiniz</option>
                                            {stores.map((s, i) => (
                                                <option key={i} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {barcode ? 'Eklenecek Miktar' : 'Stok Adedi'}
                                        </label>
                                        <input
                                            type="number"
                                            value={count}
                                            onChange={(e) => setCount(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Satış Fiyatı</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Alış Fiyatı</label>
                                        <input
                                            type="number"
                                            value={cost}
                                            onChange={(e) => setCost(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={4}
                                        placeholder="Ürün açıklaması giriniz"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Derinlik</label>
                                        <input
                                            type="text"
                                            value={length}
                                            onChange={(e) => setLength(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Yükseklik</label>
                                        <input
                                            type="text"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Genişlik</label>
                                        <input
                                            type="text"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-700">Hızlı ürün listesine ekle</span>
                                        <Switch
                                            checked={list}
                                            onChange={setList}
                                            className={`${list ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
                                        >
                                            <span className={`${list ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-all`} />
                                        </Switch>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={sumbitHandel}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Barkod Tarama</h3>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <BarcodeScanner options={options} onCapture={onCapture} />
                        
                        <div className="mt-4 flex items-center gap-2">
                            {isSupportTorch && (
                                <button
                                    onClick={onTorchSwitch}
                                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all"
                                >
                                    El Feneri
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Container>
    )
}

export default AddProduct