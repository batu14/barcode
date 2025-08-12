import React, { useEffect, useRef, useState } from 'react'
import Container from '../../Components/Container'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { FiUser, FiLock, FiSave } from "react-icons/fi"
import toast, { Toaster } from 'react-hot-toast'

const Profile = () => {
    const passwordRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordAgain, setNewPasswordAgain] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)

    useEffect(() => {
        const formdata = new FormData()
        formdata.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL+'profile.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json()).then(data => {
            setName(data[0])
            setPassword(data[1])
        })
    }, [])

    const submitHandel = () => {
        if (newPassword !== newPasswordAgain) {
            toast.error('Şifreler eşleşmiyor')
            return
        }

        const formdata = new FormData()
        formdata.append('action', 'update')
        formdata.append('password', password)
        formdata.append('oldPassword', newPassword)
        formdata.append('oldPasswordAgain', newPasswordAgain)
        
        fetch(process.env.REACT_APP_BASE_URL+'profile.php', {
            method: 'POST',
            body: formdata
        }).then(res=>res.json())
        .then(data => {
            if(data.status != 400){
                toast.success(data.message)
                setOpen(false)
                setNewPassword('')
                setNewPasswordAgain('')
            }else{
                toast.error(data.message)
            }
        })
    }

    return (
        <Container padding>
            <Toaster position='top-right' />
            
            {/* Şifre Değiştirme Modal */}
            {open && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <FiLock className="text-indigo-600" />
                            Şifre Değiştir
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Yeni şifrenizi girin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre Tekrar</label>
                                <input
                                    type="password"
                                    value={newPasswordAgain}
                                    onChange={(e) => setNewPasswordAgain(e.target.value)}
                                    className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Yeni şifrenizi tekrar girin"
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
                                onClick={submitHandel}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <FiSave size={18} />
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3">
                    <FiUser className="text-indigo-600 text-2xl" />
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Profil Ayarları</h1>
                        <p className="text-sm text-gray-500">Hesap bilgilerinizi güncelleyin</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Kullanıcı adınız"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                                placeholder="Mevcut şifreniz"
                            />
                            <button
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrentPassword ? (
                                    <FaEyeSlash size={20} />
                                ) : (
                                    <FaEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={() => setOpen(true)}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <FiLock size={18} />
                            Şifre Değiştir
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Profile