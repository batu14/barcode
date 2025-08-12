import React from 'react'
import Container from '../../Components/Container'
import { useEffect, useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { IoIosReturnLeft } from "react-icons/io";
import { MdDelete } from "react-icons/md";


const Daily = () => {

    const [price, setPrice] = useState(0)
    const [cost, setCost] = useState(0)
    const [total, setTotal] = useState(0)
    const [count, setCount] = useState([])
    const [cat, setCat] = useState([])
    const [stores, setStores] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState()
    const [date, setDate] = useState(new Date().toLocaleDateString())
    const [category, setCategory] = useState('')
    const [store, setStore] = useState('')
    const [order, setOrder] = useState(false)

    const [dailyCount, setDailyCount] = useState(0);
    useEffect(() => {
        const date = new Date();
        if (date) {
            fetchData()
        }
    }, [date]);


    useEffect(() => {
        setData(data.reverse())
    }, [order])


    const fetchData = () => {
        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'selectDay')
        formdata.append('date', date)
        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                setData([])
                setData(data)
                const s = data.filter(i => i.type == 1).length
                const r = data.filter(i => i.type == 0).length
                const c = data.filter(i => i.type == 2).length
                setCount([s, r, c])
                // setDailyCount(data.reduce((acc, curr) => console.log(curr.count,curr.name), 0));
                setDailyCount(data.reduce((acc, curr) => acc + Number(curr.count), 0));
                console.log(dailyCount);

                setLoading(false)


            })

    }

    // useEffect(() => {
    //     fetchData()
    // }, [date])

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


    const filterHandel = (e) => {
        const dataAtt = e.target.dataset.t;
        const allItems = document.querySelectorAll('[data-type]');

        allItems.forEach(item => {
            const d = item.dataset.type
            if (d != dataAtt) {
                item.classList.add('hidden')
            } else {


                item.classList.remove('hidden')

            }
        })
    }

    const filterByCategories = (e) => {

        setCategory(e.target.value)

        if (e.target.value != 0) {
            const formdata = new FormData()
            formdata.append('action', 'selectByCategory')
            formdata.append('date', date)
            formdata.append('store', store)
            formdata.append('category', e.target.value)
            fetch(process.env.REACT_APP_BASE_URL + 'panel.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json())
                .then(data => {
                    setPrice(data[0].price)
                    setCost(data[0].cost)
                    setTotal(data[0].count)
                })
            const allItems = document.querySelectorAll('[data-category]');

            allItems.forEach(item => {

                const d = item.dataset.category

                if (d != e.target.value) {
                    item.classList.add('hidden')
                } else {
                    item.classList.remove('hidden')

                }

            })
        }
    }
    const filterByStore = (e) => {

        setStore(e.target.value)

        if (e.target.value != 0) {


            const formdata = new FormData()
            formdata.append('action', 'selectByStore')
            formdata.append('date', date)
            formdata.append('store', e.target.value)
            fetch(process.env.REACT_APP_BASE_URL + 'panel.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json())
                .then(data => {
                    setPrice(data[0].price)
                    setCost(data[0].cost)
                    setTotal(data[0].count)
                })

            const allItems = document.querySelectorAll('[data-store]');

            allItems.forEach(item => {

                const d = item.dataset.store

                if (d != e.target.value) {
                    item.classList.add('hidden')
                } else {
                    item.classList.remove('hidden')

                }

            })
        }

    }



    const deleteHandel = (item) => {
        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'cancel')
        formdata.append('id', item.id);
        formdata.append('store', item.store)
        formdata.append('barcode', item.barcode)
        formdata.append('count', item.count)
        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (data.status != 200) {
                    toast.error(data.message)
                } else {
                    fetchData()
                    setLoading(false)
                }
            })

    }




    const returnHandel = (item) => {
        const formdata = new FormData()
        formdata.append('action', 'dailyReturn')
        formdata.append('basket', JSON.stringify(item))
        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (data.status != 200) {
                    toast.error(data.message)
                } else {
                    fetchData()
                    setLoading(false)
                }
            })

    }


    return (
        <Container padding>
            <Toaster position='top-right' />
            <div className="flex w-full flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Günlük Satılanlar</h1>
                <div className="flex w-full items-center justify-end gap-2">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border w-full md:w-auto border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {data && data.length > 0 && (
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-100 rounded-xl p-4 flex flex-col items-center shadow">
                        <span className="text-indigo-600 text-3xl font-bold">{dailyCount && dailyCount}</span>
                        <span className="text-gray-700 font-medium mt-2">Toplam Satış</span>
                    </div>
                    <div className="bg-red-100 rounded-xl p-4 flex flex-col items-center shadow">
                        <span className="text-red-600 text-3xl font-bold">{count[1]}</span>
                        <span className="text-gray-700 font-medium mt-2">Toplam İade</span>
                    </div>
                    <div className="bg-yellow-100 rounded-xl p-4 flex flex-col items-center shadow">
                        <span className="text-yellow-600 text-3xl font-bold">{count[2]}</span>
                        <span className="text-gray-700 font-medium mt-2">Toplam Zaiat</span>
                    </div>
                </div>
            )}

            {data && data.length > 0 && (
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-50 rounded-xl p-4 flex flex-col items-center shadow">
                        <span className="text-gray-700 font-medium">Toplam Satış</span>
                        <span className="text-indigo-600 text-xl font-bold">{price}</span>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center shadow">
                        <span className="text-gray-700 font-medium">Toplam Maliyet</span>
                        <span className="text-red-600 text-xl font-bold">{cost}</span>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center shadow">
                        <span className="text-gray-700 font-medium">Toplam Adet</span>
                        <span className="text-yellow-600 text-xl font-bold">{total}</span>
                    </div>
                </div>
            )}

            {data.length > 0 && (
                <div className="flex w-full items-center justify-center gap-4 mb-6">
                    <button
                        onClick={(e) => filterHandel(e)}
                        data-t="1"
                        className="px-6 w-full py-2 rounded-lg font-semibold transition
                            bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                        Satış
                    </button>
                    <button
                        onClick={(e) => filterHandel(e)}
                        data-t="0"
                        className="px-6 w-full py-2 rounded-lg font-semibold transition
                            bg-red-500 text-white hover:bg-red-600"
                    >
                        İade
                    </button>
                    <button
                        onClick={(e) => filterHandel(e)}
                        data-t="2"
                        className="px-6 w-full py-2 rounded-lg font-semibold transition
                            bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                        Zaiat
                    </button>
                </div>
            )}

            {data.length > 0 && (
                <div className="flex w-full flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-1">Depo</label>
                        <select
                            value={store}
                            onChange={filterByStore}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={0}>Depo Seçiniz</option>
                            {stores.map((store, idx) => (
                                <option value={store.name} key={idx}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                    {store !== 0 && (
                        <div className="flex-1">
                            <label className="block text-gray-700 mb-1">Kategori</label>
                            <select
                                value={category}
                                onChange={filterByCategories}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={0}>Kategori Seçiniz</option>
                                {cat.map((category, idx) => (
                                    <option value={category.name} key={idx}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            <div className="flex w-full items-center justify-end mb-6">
                <button
                    onClick={() => setOrder(!order)}
                    className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
                >
                    {order ? "En Yeni" : "En Eski"}
                    <FaArrowUp className={order ? "" : "rotate-180"} />
                </button>
            </div>

            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading !== true ? data.map((item, idx) => (
                    <div
                        key={idx}
                       
                        className={`bg-white rounded-xl shadow-lg p-4 flex flex-col transition ${item.type == 2 && 'border-2 border-yellow-400'  || item.type == 0 && 'border-2 border-red-600' || item.type == 1 && 'border-2 border-indigo-600'}`}
                        data-type={item.type}
                        data-store={item.store}
                        data-category={item.category}
                    >
                        <img
                            src={item.image || 'https://placehold.co/600x400'}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                            alt=""
                        />
                        <div className="flex flex-col gap-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                            <p className="text-sm text-gray-500">Barkod: {item.barcode}</p>
                            <p className="text-sm text-indigo-600 font-bold">{parseInt(item.price).toFixed(2)} TL</p>
                            <p className="text-sm text-gray-700">{item.count} Adet</p>
                            <p className="text-xs text-gray-400">Kullanıcı: {item.user}</p>
                            <p className="text-xs text-gray-400">Tarih: {item.date}</p>
                        </div>
                        <div className='flex gap-2 pb-2 items-start justify-start'>
                           
                            <p className='text-xs text-gray-400 text-left'>{item.type == 1 && 'İşlem Tipi: Satış'}</p>
                            <p className='text-xs text-gray-400 text-left'>{item.type == 0 && 'İşlem Tipi: İade'}</p>
                            <p className='text-xs text-gray-400 text-left'>{item.type == 2 && 'İşlem Tipi: Zaiat'}</p>
                        </div>
                        <div className="flex gap-2">
                            {item.type === 0 && (
                                <span className="flex-1 bg-red-600 text-white text-center rounded-lg py-2 font-bold">İade</span>
                            )}
                            <button
                                onClick={() => deleteHandel(item)}
                                className="flex-1 flex items-center justify-center bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition"
                            >
                                <MdDelete />
                            </button>
                            {item.type !== 0 && (
                                <button
                                    onClick={() => returnHandel(item)}
                                    className="flex-1  bg-indigo-500 text-white rounded-lg py-2 hover:bg-indigo-600 transition flex items-center justify-center gap-2"
                                >
                                    <IoIosReturnLeft size={20} />
                                    Hızlı İade
                                </button>
                            )}
                        </div>
                    </div>
                )) : null}
            </div>
        </Container>
    )
}

export default Daily