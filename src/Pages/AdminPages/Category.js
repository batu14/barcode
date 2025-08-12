import React, { useState, useEffect } from 'react'
import Container from '../../Components/Container'
import DataTable from 'react-data-table-component'
import toast, { Toaster } from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash, FaTags, FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Category = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [data, setData] = useState([])
    const [update, setUpdate] = useState(false)
    const [id, setId] = useState()
    const [filterText, setFilterText] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error('Kategori adı boş olamaz')
            return
        }

        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', update ? 'update' : 'insert')
        formdata.append('name', name)
        if (update) formdata.append('id', id)

        toast.promise(
            fetch(process.env.REACT_APP_BASE_URL + 'categories.php', {
                method: 'POST',
                body: formdata
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 400) throw new Error(data.message)
                    fetchData()
                    handleClose()
                    return data
                }),
            {
                loading: update ? 'Güncelleniyor...' : 'Kaydediliyor...',
                success: update ? 'Kategori güncellendi!' : 'Yeni kategori eklendi!',
                error: (err) => err.message
            }
        ).finally(() => setLoading(false))
    }

    const handleClose = () => {
        setOpen(false)
        setName('')
        setUpdate(false)
        setId(null)
    }

    const fetchData = () => {
        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'select')
        
        fetch(process.env.REACT_APP_BASE_URL + 'categories.php', {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
            .catch(() => toast.error('Veriler yüklenirken bir hata oluştu'))
            .finally(() => setLoading(false))
    }

    const handleDelete = (row) => {
        toast((t) => (
            <div className='flex flex-col gap-4'>
                <p className='text-sm'>
                    <strong>{row.name}</strong> kategorisini silmek istediğinize emin misiniz?
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
                            confirmDelete(row)
                            toast.dismiss(t.id)
                        }}
                    >
                        Sil
                    </button>
                </div>
            </div>
        ), { duration: 5000 })
    }

    const confirmDelete = (row) => {
        setLoading(true)
        const formdata = new FormData()
        formdata.append('action', 'delete')
        formdata.append('id', row.id)
        formdata.append('cat', row.name)

        toast.promise(
            fetch(process.env.REACT_APP_BASE_URL + 'categories.php', {
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
                success: 'Kategori başarıyla silindi!',
                error: (err) => err.message
            }
        ).finally(() => setLoading(false))
    }

    const handleUpdate = (row) => {
        setOpen(true)
        setUpdate(true)
        setName(row.name)
        setId(row.id)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data.filter(
        item => item.name.toLowerCase().includes(filterText.toLowerCase())
    )

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

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Kategori',
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: 'İşlemler',
            cell: row => (
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => handleUpdate(row)}
                        className='p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors'
                        title='Düzenle'
                    >
                        <FaEdit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                        title='Sil'
                    >
                        <FaTrash size={18} />
                    </button>
                </div>
            ),
            width: '150px'
        }
    ]

    return (
        <Container padding>
            <Toaster position='top-right' />
            
            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className='bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden'
                        >
                            <div className='p-6'>
                                <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                                    {update ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                                </h2>
                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Kategori Adı
                                        </label>
                                        <input
                                            type='text'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                            placeholder='Kategori adını girin'
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='bg-gray-50 px-6 py-4 flex justify-end gap-3'>
                                <button
                                    onClick={handleClose}
                                    className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                                    disabled={loading}
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className='w-5 h-5 border-t-2 border-white rounded-full animate-spin' />
                                    ) : update ? (
                                        <>
                                            <FaEdit size={16} />
                                            Güncelle
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus size={16} />
                                            Ekle
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className='bg-white w-full px-4 rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                        <FaTags className='text-indigo-600 text-2xl' />
                        <div>
                            <h1 className='text-xl font-bold text-gray-800'>Kategoriler</h1>
                            <p className='text-sm text-gray-500'>Ürün kategorilerini yönetin</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='relative'>
                            <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                            <input
                                type='text'
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                                placeholder='Kategori ara...'
                                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                            />
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2'
                        >
                            <FaPlus size={16} />
                            Yeni Kategori
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='bg-white w-full px-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    customStyles={customStyles}
                    progressPending={loading}
                    progressComponent={
                        <div className='flex items-center justify-center h-64'>
                            <div className='w-8 h-8 border-t-2 border-indigo-600 rounded-full animate-spin' />
                        </div>
                    }
                    noDataComponent={
                        <div className='flex flex-col items-center justify-center p-8 text-gray-500'>
                            <FaTags className='text-4xl mb-2 opacity-50' />
                            <p className='text-lg font-medium'>Henüz kategori bulunmuyor</p>
                            <p className='text-sm'>Yeni kategori ekleyerek başlayın</p>
                        </div>
                    }
                />
            </div>
        </Container>
    )
}

export default Category