import React, { useEffect, useState } from 'react'
import Container from '../../Components/Container'
import toast, { Toaster } from 'react-hot-toast'
import { FaWarehouse, FaMapMarkerAlt, FaPhone, FaBoxes, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Store = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [location, setLocation] = useState('')
    const [phone, setPhone] = useState('')
    const [capacity, setCapacity] = useState('')
    const [items, setItems] = useState([])
    const [id, setId] = useState()
    const [update, setUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const resetForm = () => {
        setName('')
        setLocation('')
        setPhone('')
        setCapacity('')
        setId(null)
        setUpdate(false)
    }

    const handleSubmit = () => {
        if (!name.trim() || !location.trim() || !phone.trim() || !capacity) {
            toast.error('Lütfen tüm alanları doldurun')
            return
        }

        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', update ? 'update' : 'insert')
        formdata.append('name', name)
        formdata.append('location', location)
        formdata.append('capacity', capacity)
        formdata.append('phone', phone)
        if (update) formdata.append('id', id)

        toast.promise(
            fetch(process.env.REACT_APP_BASE_URL + 'store.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 400) throw new Error(data.message)
                    fetchData()
                    setOpen(false)
                    resetForm()
                    return data
                }),
            {
                loading: update ? 'Güncelleniyor...' : 'Kaydediliyor...',
                success: update ? 'Depo güncellendi!' : 'Yeni depo eklendi!',
                error: (err) => err.message
            }
        ).finally(() => setLoading(false))
    }

    const handleDelete = (item) => {
        toast((t) => (
            <div className='flex flex-col gap-4'>
                <p className='text-sm'>
                    <strong>{item.name}</strong> deposunu silmek istediğinize emin misiniz?
                </p>
                <div className='flex justify-end gap-2'>
                    <button
                        className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded'
                        onClick={() => toast.dismiss(t.id)}
                    >
                        İptal
                    </button>
                    <button
                        className='px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded'
                        onClick={() => {
                            confirmDelete(item)
                            toast.dismiss(t.id)
                        }}
                    >
                        Sil
                    </button>
                </div>
            </div>
        ), { duration: 5000 })
    }

    const confirmDelete = (item) => {
        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'delete')
        formdata.append('id', item.id)
        formdata.append('name', item.name)

        toast.promise(
            fetch(process.env.REACT_APP_BASE_URL + 'store.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 400) throw new Error(data.message)
                    fetchData()
                    return data
                }),
            {
                loading: 'Siliniyor...',
                success: 'Depo başarıyla silindi!',
                error: (err) => err.message
            }
        ).finally(() => setLoading(false))
    }

    const fetchData = () => {
        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'select')
        
        fetch(process.env.REACT_APP_BASE_URL + 'store.php', {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(() => toast.error('Veriler yüklenirken bir hata oluştu'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Container>
            <Toaster position="top-right" />
            
            {/* Modal */}
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
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FaWarehouse className="text-indigo-600 text-2xl" />
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {update ? 'Depo Düzenle' : 'Yeni Depo Ekle'}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Depo Adı</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Depo adını girin"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Depo konumunu girin"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite</label>
                                        <input
                                            type="number"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Depo kapasitesini girin"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Telefon numarasını girin"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setOpen(false)
                                        resetForm()
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {update ? <FaEdit size={16} /> : <FaPlus size={16} />}
                                            {update ? 'Güncelle' : 'Ekle'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FaWarehouse className="text-indigo-600 text-2xl" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Depolar</h1>
                            <p className="text-sm text-gray-500">Tüm depoları yönetin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Depo ara..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus size={16} />
                            Yeni Depo
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading && items.length === 0 ? (
                <div className="flex items-center w-full justify-center h-64">
                    <div className="w-8 h-8 border-t-2 border-indigo-600 rounded-full animate-spin" />
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{item.name}</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{item.location}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaPhone className="text-gray-400" />
                                        <a href={`tel:${item.phone}`} className="hover:text-indigo-600">
                                            {item.phone}
                                        </a>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaBoxes className="text-gray-400" />
                                        <span>{item.capacity} birim kapasite</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-2">
                                <button
                                    onClick={() => {
                                        setUpdate(true)
                                        setId(item.id)
                                        setName(item.name)
                                        setLocation(item.location)
                                        setPhone(item.phone)
                                        setCapacity(item.capacity)
                                        setOpen(true)
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <FaEdit size={16} />
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <FaTrash size={16} />
                                    Sil
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col w-full items-center justify-center h-64 text-gray-500">
                    <FaWarehouse className="text-4xl mb-4 opacity-50" />
                    {searchQuery ? (
                        <>
                            <p className="text-lg font-medium">Depo bulunamadı</p>
                            <p className="text-sm">Farklı bir arama terimi deneyin</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium">Henüz depo bulunmuyor</p>
                            <p className="text-sm">Yeni depo ekleyerek başlayın</p>
                        </>
                    )}
                </div>
            )}
        </Container>
    )
}

export default Store