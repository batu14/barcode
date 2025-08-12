import React, { useEffect } from 'react';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa6';

const SalesCard = ({ func, value, item }) => {
    const deleteItem = () => {
        const itemCount = value.filter((i) => i.barcode === item.barcode).length;
        if (itemCount >= 1) {
            const index = value.findIndex((i) => i.barcode === item.barcode);
            value[index].count -= 1;
            func([...value]);
        }
        if (item.count <= 0) {
            func(value.filter((i) => i.barcode !== item.barcode));
        }
    };

    const addItem = () => {
        const index = value.findIndex((i) => i.barcode === item.barcode);
        if (index !== -1) {
            value[index].count += 1;
            func([...value]);
        }
    };

    return (
        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300'>
            {/* Ürün Resmi */}
            <div className='relative'>
                <img 
                    src={item.image} 
                    className='w-full h-48 object-cover' 
                    alt={item.name}
                />
                <div className='absolute top-2 right-2 bg-white px-3 py-1.5 rounded-full shadow-md'>
                    <span className='text-sm font-bold text-indigo-600'>{item.price} TL</span>
                </div>
            </div>

            {/* Ürün Bilgileri */}
            <div className='p-4 space-y-4'>
                <div>
                    <h2 className='text-lg font-semibold text-gray-800 mb-1'>{item.name}</h2>
                    <p className='text-sm text-gray-500'>{item.barcode}</p>
                </div>

                {/* Miktar Kontrolü */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <button 
                            onClick={deleteItem}
                            className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                        >
                            <FaMinus size={12} className="text-gray-600" />
                        </button>
                        <span className='text-base font-medium text-gray-800'>{item.count}</span>
                        <button 
                            onClick={addItem}
                            className='w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                        >
                            <FaPlus size={12} className="text-gray-600" />
                        </button>
                    </div>
                    <span className='text-sm font-medium text-gray-600'>
                        Toplam: {(item.price * item.count).toFixed(2)} TL
                    </span>
                </div>

                {/* Detaylar ve Sepetten Çıkar */}
                <div className='pt-4 border-t border-gray-100 flex items-center justify-between'>
                    <details className='text-sm text-gray-600'>
                        <summary className='cursor-pointer hover:text-gray-800 transition-colors'>
                            Detaylar
                        </summary>
                        <ul className='mt-2 space-y-1'>
                            <li>Maliyet: {item.cost} TL</li>
                            <li>Stok: {item.store}</li>
                        </ul>
                    </details>
                    <button 
                        onClick={() => func(value.filter((i) => i.barcode !== item.barcode))}
                        className='flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium'
                    >
                        <FaTrash size={12} />
                        <span>Sepetten Çıkar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesCard;