import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { Switch } from '@headlessui/react'
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [admin, setAdmin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleLogin = () => {
        if (!name || !password) {
            toast.error('Lütfen tüm alanları doldurun')
            return
        }

        const formdata = new FormData()
        formdata.append('action', admin ? 'adminLogin' : 'personelLogin')
        formdata.append('name', name)
        formdata.append('password', password)

        fetch(process.env.REACT_APP_BASE_URL+'profile.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if (data.status != 200) {
                toast.error(data.message)
            } else {
                window.localStorage.setItem('token', data.data.token)
                window.localStorage.setItem('user', data.data.name)
                window.localStorage.setItem('role', data.data.role)

                if(data.data.role != 'admin'){
                    navigate('/dashboard/userPanel')
                } else {
                    navigate('/dashboard/panel')
                }
            }
        })
        .catch(() => {
            toast.error('Bir hata oluştu')
        })
    }

    useEffect(() => {
        window.localStorage.clear()
    }, [])

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
            <Toaster position='top-right' />
            
            <div className="w-full max-w-md">
                {/* Logo veya Uygulama Adı */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Barkod Sistemi
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Hoş geldiniz, lütfen giriş yapın
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-xl p-8">
                    {/* Kullanıcı Tipi Seçimi */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className={`text-sm ${!admin ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            Personel
                        </span>
                        <Switch
                            checked={admin}
                            onChange={setAdmin}
                            className={`${
                                admin ? 'bg-indigo-500' : 'bg-green-500'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                            <span
                                className={`${
                                    admin ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                        <span className={`text-sm ${admin ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                            Yönetici
                        </span>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Kullanıcı adınız"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2.5 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Şifreniz"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash size={20} />
                                    ) : (
                                        <FaEye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            className={`w-full py-2.5 flex items-center justify-center gap-2 text-white rounded-lg transition-colors ${
                                admin 
                                ? 'bg-indigo-600 hover:bg-indigo-700' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            <FiLogIn size={20} />
                            Giriş Yap
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    {admin ? 'Yönetici' : 'Personel'} girişi yapıyorsunuz
                </p>
            </div>
        </div>
    )
}

export default Login