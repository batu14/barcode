import React, { useEffect, useState, useCallback } from 'react'
import Container from '../../Components/Container'
import DataTable from 'react-data-table-component'
import toast, { Toaster } from 'react-hot-toast'
import { FaWarehouse, FaBoxes, FaSearch, FaExchangeAlt, FaSync, FaBarcode } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import debounce from 'lodash/debounce'

const StoreDetail = () => {
    const [open, setOpen] = useState(false)
    const [stores, setStores] = useState([])
    const [products, setProducts] = useState([])
    const [barcode, setBarcode] = useState('')
    const [selectedStore, setSelectedStore] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [update, setUpdate] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [transferLoading, setTransferLoading] = useState(false)
    const [count, setCount] = useState(1)
    const [id, setID] = useState()

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (!query) {
                fetchProducts()
                return
            }

            setLoading(true)
            const formdata = new FormData()
            formdata.append('action', 'findByBarcodeForStore')
            formdata.append('barcode', query)

            fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 200) {
                        setProducts(data.data)
                    }
                })
                .catch(() => toast.error('Arama sırasında bir hata oluştu'))
                .finally(() => setLoading(false))
        }, 500),
        []
    )

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const formdata = new FormData()
            formdata.append('action', 'select')
            
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            })
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            toast.error('Ürünler yüklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const fetchStores = async () => {
        try {
            const formdata = new FormData()
            formdata.append('action', 'select')
            
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'store.php', {
                method: 'POST',
                body: formdata
            })
            const data = await response.json()
            setStores(data)
            if (data.length > 0) setSelectedStore(data[0].name)
        } catch (error) {
            toast.error('Depolar yüklenirken bir hata oluştu')
        }
    }

    useEffect(() => {
        Promise.all([fetchProducts(), fetchStores()])
    }, [])

    useEffect(() => {
        debouncedSearch(searchQuery)
        return () => debouncedSearch.cancel()
    }, [searchQuery, debouncedSearch])

    const handleTransfer = async (single = false) => {
        if (!selectedStore) {
            toast.error('Lütfen bir depo seçin')
            return
        }

        setTransferLoading(true)
        try {
            const formdata = new FormData()
            if (single) {
                formdata.append('action', 'storeUpdate')
                formdata.append('id', id)
                formdata.append('barcode', barcode)
                formdata.append('store', selectedStore)
                formdata.append('count', count)
            } else {
                formdata.append('action', 'multi')
                formdata.append('store', selectedStore)
                formdata.append('selected', JSON.stringify(selectedRows))
            }

            const response = await fetch(process.env.REACT_APP_BASE_URL + 'product.php', {
                method: 'POST',
                body: formdata
            })
            const data = await response.json()

            if (data.status === 200) {
                toast.success(data.message)
                setOpen(false)
                fetchProducts()
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'İşlem sırasında bir hata oluştu')
        } finally {
            setTransferLoading(false)
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
            name: 'Barkod',
            selector: row => row.barcode,
            sortable: true,
            width: '130px'
        },
        {
            name: 'Ürün Adı',
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: 'Depo',
            selector: row => row.store,
            sortable: true
        },
        {
            name: 'Adet',
            selector: row => row.count,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Maliyet',
            selector: row => `${row.cost}₺`,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Fiyat',
            selector: row => `${row.price}₺`,
            sortable: true,
            width: '120px'
        },
        {
            name: 'İşlem',
            cell: row => (
                <button
                    onClick={() => {
                        setID(row.id)
                        setBarcode(row.barcode)
                        setUpdate(false)
                        setOpen(true)
                    }}
                    className='px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2'
                    disabled={transferLoading}
                >
                    <FaExchangeAlt size={14} />
                    Aktar
                </button>
            ),
            width: '120px'
        }
    ]

    const customStyles = {
        table: {
            style: {
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            }
        },
        headRow: {
            style: {
                backgroundColor: '#f8fafc',
                borderTopLeftRadius: '0.5rem',
                borderTopRightRadius: '0.5rem',
                borderBottomWidth: '1px',
                borderBottomColor: '#e2e8f0',
            }
        },
        headCells: {
            style: {
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: '600',
                paddingTop: '1rem',
                paddingBottom: '1rem',
            }
        },
        cells: {
            style: {
                paddingTop: '1rem',
                paddingBottom: '1rem',
            }
        }
    }

    return (
        <Container>
            <Toaster position="top-right" />

            {/* Transfer Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FaExchangeAlt className="text-indigo-600 text-xl" />
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Ürün Transfer
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hedef Depo
                                        </label>
                                        <select
                                            value={selectedStore}
                                            onChange={(e) => setSelectedStore(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={transferLoading}
                                        >
                                            {stores.map((store) => (
                                                <option key={store.id} value={store.name}>
                                                    {store.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {!update && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Adet
                                            </label>
                                            <input
                                                type="number"
                                                value={count}
                                                onChange={(e) => setCount(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Transfer edilecek adet"
                                                min="1"
                                                disabled={transferLoading}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={transferLoading}
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={() => handleTransfer(!update)}
                                    disabled={transferLoading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    {transferLoading ? (
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaExchangeAlt size={14} />
                                            Transfer Et
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-white w-full px-8 rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FaBoxes className="text-indigo-600 text-2xl" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Ürün Transferi</h1>
                            <p className="text-sm text-gray-500">Depolar arası ürün transferi yapın</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <FaBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Barkod ile ara..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        {selectedRows.length > 0 && (
                            <button
                                onClick={() => {
                                    setUpdate(true)
                                    setOpen(true)
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                disabled={transferLoading}
                            >
                                <FaExchangeAlt size={14} />
                                Toplu Transfer ({selectedRows.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <div className="bg-white w-full px-8 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={products}
                    selectableRows
                    pagination
                    progressPending={loading}
                    progressComponent={
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-8 h-8 border-t-2 border-indigo-600 rounded-full animate-spin mb-4" />
                            <p className="text-gray-500">Ürünler yükleniyor...</p>
                        </div>
                    }
                    onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
                    customStyles={customStyles}
                    noDataComponent={
                        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                            <FaBoxes className="text-4xl mb-2 opacity-50" />
                            <p className="text-lg font-medium">Ürün bulunamadı</p>
                            <p className="text-sm">Farklı bir arama terimi deneyin</p>
                        </div>
                    }
                />
            </div>
        </Container>
    )
}

export default StoreDetail