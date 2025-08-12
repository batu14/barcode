import React from 'react'

const StoreCard = ({item}) => {
    return (
        <div className='w-full flex flex-col p-2 shadow-md rounded-md  items-center justify-center gap-4'>
            <div className='w-full'>
                <img src={item.image} alt="" className='w-full rounded-md' />
            </div>
            <div className='w-full flex-col items-start justify-between gap-4'>
                <h1 className='text-xl font-semibold text-gray-700'>{item.name}</h1>
                <p className='text-gray-500'>{item.location}</p>
                <div className='w-full flex items-center justify-center gap-4'>
                    <button className='w-full bg-indigo-400 text-white px-4 py-2 rounded-md'>Düzenle</button>
                    <button className='w-full bg-red-400 text-white px-4 py-2 rounded-md'>Sil</button>
                </div>
            </div>
        </div>
    )
}

export default StoreCard