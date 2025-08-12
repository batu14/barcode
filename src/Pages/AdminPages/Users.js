import React, { useEffect, useState } from 'react'
import Container from '../../Components/Container'
import DataTable from 'react-data-table-component'
import toast, { Toaster } from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSearch } from 'react-icons/fi'

const Users = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState('')
    const [password, setPassword] = useState('')
    const [update, setUpdate] = useState(false)
    const [id, setId] = useState()
    const [data, setData] = useState([])

    useEffect(() => {
        const formdata = new FormData()
        formdata.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL+'users.php', {
            method: 'POST',
            body: formdata
        })
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
    }, [])

    const toggleHandeler = (e) => {
        if (e.target.classList.contains('close')) {
            setOpen(false)
        }
    }

    const submitHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'insert')
        formdata.append('name', name)
        formdata.append('surname', surname)
        formdata.append('phone', phone)
        formdata.append('role', role)
        formdata.append('password', password)
        fetch(process.env.REACT_APP_BASE_URL+'users.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(data.status != 400){
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        })
        .catch(e => console.error(e))
    }

    const updateHandel = (row) => {
        setUpdate(true)
        setOpen(true)
        setId(row.id)
        setName(row.name)
        setSurname(row.surname)
        setPhone(row.phone)
    }

    const fetchHandel = () => {
        const formdata = new FormData()
        formdata.append('action', 'update')
        formdata.append('id', id)
        formdata.append('name', name)
        formdata.append('surname', surname)
        formdata.append('phone', phone)
        formdata.append('role', role)
        formdata.append('password', password)
        fetch(process.env.REACT_APP_BASE_URL+'users.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(data.status != 400){
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        })
        .catch(e => console.error(e))
    }

    const deleteHandel = (id) => {
        const formdata = new FormData()
        formdata.append('action', 'delete')
        formdata.append('id', id)
        fetch(process.env.REACT_APP_BASE_URL+'users.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(data.status != 400){
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        })
        .catch(e => console.error(e))
    }
    
    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'İsim',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Soyisim',
            selector: row => row.surname,
            sortable: true,
        },
        {
            name: 'Telefon',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Rol',
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-sm ${
                    row.role === 'admin' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                    {row.role === 'admin' ? 'Yönetici' : 'Personel'}
                </span>
            ),
            sortable: true,
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

    return (
        <Container padding>
            <Toaster position='top-right' />
            
            {open && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {update ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Kullanıcı adı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                                <input
                                    type="text"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Kullanıcı soyadı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Telefon numarası"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Kullanıcı şifresi"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Rol seçin</option>
                                    <option value="admin">Yönetici</option>
                                    <option value="user">Personel</option>
                                </select>
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

            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <FiUsers className="text-indigo-600 text-2xl" />
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Kullanıcı Yönetimi</h1>
                            <p className="text-sm text-gray-500">Sistem kullanıcılarını yönetin</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow lg:w-80">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Kullanıcı ara..."
                                className="w-full pl-10 pr-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <FiPlus size={18} />
                            Yeni Kullanıcı
                        </button>
                    </div>
                </div>
            </div>

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

export default Users