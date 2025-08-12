import React, { useEffect, useState } from 'react'
import Container from '../../Components/Container'
import DataTable from 'react-data-table-component'
import toast, { Toaster } from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiBell, FiSearch } from 'react-icons/fi'

const Notification = () => {
    const [open, setOpen] = useState(false)
    const [openA, setOpenA] = useState(false)
    const [product, setProduct] = useState('')
    const [id, setİd] = useState()
    const [count, setCount] = useState(0)
    const [update, setUpdate] = useState(false)
    const [data, setData] = useState([])
    const [products, setProducts] = useState([])
    const [barcode, setBarcode] = useState('')

    useEffect(() => {
        const formdata = new FormData()
        formdata.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL + 'notification.php', {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
        const formdata2 = new FormData()
        formdata2.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then(data => {
                setProducts(data)
            })
    }, [])

    const submitHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'insert')
        formdata.append('product', product.replace('-', ''))
        formdata.append('count', count)
        formdata.append('barcode', barcode)
        fetch(process.env.REACT_APP_BASE_URL + 'notification.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (data.status != 200) {
                    toast.error('Bir hata oldu')
                } else {
                    toast.success('Bildirim başarıyla kaydedildi')
                    setOpen(!open)
                    setInterval(() => {
                        window.location.reload()
                    }, 300);
                }
            })
    }

    const toggleHandeler = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('close')) {
            setOpen(false)
        }
    }
    const toggleHandelerA = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('close')) {
            setOpen(false)
        }
    }

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Ürün',
            selector: row => row.product.replace('_', ' '),
            sortable: true,
            grow: 2
        },
        {
            name: 'Adet',
            selector: row => row.count,
            sortable: true,
            center: true,
            width: '120px'
        },
        {
            name: 'İşlem',
            cell: row => (
                <div className='flex items-center gap-2'>
                    <button 
                        onClick={() => updateHandel(row)} 
                        className='p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                    >
                        <FiEdit2 size={18} />
                    </button>
                    <button 
                        onClick={() => deleteHandel(row.id)} 
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            ),
            width: '120px'
        }
    ]

    const updateHandel = (row) => {
        setOpen(true)
        setUpdate(true)
        setProduct(row.product)
        setCount(row.count)
        setİd(row.id)
    }

    const allİtemsSet = () => {
        const formdata = new FormData()
        formdata.append('action', 'allİtemsSet')
        formdata.append('count', count)
        formdata.append('role', localStorage.getItem('role'))
        fetch(process.env.REACT_APP_BASE_URL + 'notification.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                toast('Bu işlem biraz sürebilir',
                    {
                        duration: 2000
                    }
                )
                if(data.status != 200){
                    toast.error(data.message)
                }else{
                    toast.success(data.message)
                }
            })
    }

    const fetchHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'update')
        formdata.append('id', id)
        formdata.append('product', product)
        formdata.append('barcode', barcode)
        formdata.append('count', count)
        fetch(process.env.REACT_APP_BASE_URL + 'notification.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json()).then(data => {
            if (data.status != 200) {
                toast.error('Bir hata oldu')
            } else {
                setOpen(false)
                toast.success('Silme işlmemi başarıyla yapıldı')
            }
        }).catch(err => {
            console.log(err)
        }
        )
    }

    const deleteHandel = (id) => {
        const formdata = new FormData()
        formdata.append('action', 'delete')
        formdata.append('id', id)
        fetch(process.env.REACT_APP_BASE_URL + 'notification.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (data.status != 200) {
                    toast.error('Bir hata oldu')
                } else {
                    toast.success('Silme işlmemi başarıyla yapıldı')
                }
            }
            )
            .catch(e => console.error(e))
    }

    const optionHandel = (e) => {
        setProduct(e.target.value.split('-')[0])
        setBarcode(e.target.value.split('-')[1])
    }

    return (
        <Container padding>
            <Toaster position='top-right' />
            
            {/* Modal - Yeni/Düzenle */}
            {open && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {update ? 'Bildirimi Düzenle' : 'Yeni Bildirim Ekle'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün</label>
                                <div className="relative">
                                    <input 
                                        list="products"
                                        onChange={optionHandel}
                                        className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Ürün seçin..."
                                    />
                                    <datalist id="products">
                                        {products.map(product => (
                                            <option 
                                                key={product.id} 
                                                value={`${product.name}-${product.barcode}`}
                                            />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adet</label>
                                <input
                                    type="number"
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Minimum stok adedi"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={update ? fetchHandel : submitHandel}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                {update ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal - Toplu İşlem */}
            {openA && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Toplu Bildirim Ayarla</h2>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <FiBell className="text-amber-500 mt-1" />
                                <div>
                                    <p className="text-sm text-amber-800 font-medium">Önemli Uyarı</p>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Bu işlem tüm ürünler için geçerli olacak ve mevcut bildirim ayarları sıfırlanacaktır.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stok Adedi</label>
                            <input
                                type="number"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Tüm ürünler için minimum stok adedi"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setOpenA(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={allİtemsSet}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Uygula
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header ve Search Birleşik */}
            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <FiBell className="text-indigo-600 text-2xl" />
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Stok Bildirimleri</h1>
                            <p className="text-sm text-gray-500">Minimum stok seviyesi bildirimleri</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow lg:w-80">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                placeholder="Ürün ara..."
                                className="w-full pl-10 pr-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => setOpen(true)}
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <FiPlus size={18} />
                                Yeni Bildirim
                            </button>
                            <button
                                onClick={() => setOpenA(true)}
                                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                            >
                                Toplu Ayarla
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    customStyles={{
                        table: {
                            style: {
                                backgroundColor: 'white',
                                borderRadius: '0.75rem'
                            }
                        },
                        headRow: {
                            style: {
                                backgroundColor: '#f8fafc',
                                borderBottomWidth: '1px',
                                borderBottomColor: '#e2e8f0'
                            }
                        },
                        headCells: {
                            style: {
                                color: '#64748b',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                padding: '1rem'
                            }
                        },
                        cells: {
                            style: {
                                fontSize: '0.875rem',
                                padding: '1rem',
                                color: '#334155'
                            }
                        }
                    }}
                />
            </div>
        </Container>
    )
}

export default Notification