import React, { useEffect, useRef, useState, useCallback } from 'react'
import Container from '../../Components/Container'
import { FaHistory, FaCalendar, FaSearch, FaSpinner } from 'react-icons/fa'

const ProductHistory = () => {
  const [date, setDate] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [store, setStore] = useState('')
  const [cat, setCat] = useState([])
  const [stores, setStores] = useState([])
  const observer = useRef()
  const [page, setPage] = useState(1)

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

  const lastCarElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    setPage(prevPage => prevPage + 1);
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const filterByCategories = (e) => {
    setCategory(e.target.value)

    if (e.target.value != 0) {
      const formdata = new FormData()
      formdata.append('action', 'selectByCategory')
      formdata.append('store', store)
      formdata.append('date', date)
      formdata.append('category', e.target.value)
      fetch(process.env.REACT_APP_BASE_URL + 'history.php', {
        method: 'POST',
        body: formdata
      }).then(res => res.json())
        .then(data => {
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
      formdata.append('store', e.target.value)
      formdata.append('date', date)
      fetch(process.env.REACT_APP_BASE_URL + 'history.php', {
        method: 'POST',
        body: formdata
      }).then(res => res.json())
        .then(data => {
          setData(data)
          setLoading(false)
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

  return (
    <Container padding>
      {/* Üst Panel */}
      <div className='w-full flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm mb-4'>
        <div className='flex items-center gap-3'>
          <FaHistory className='text-indigo-600 text-2xl' />
          <h1 className='text-xl font-semibold'>Ürün Geçmişi</h1>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <FaCalendar className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg'
            />
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className='w-full bg-white p-4 rounded-lg shadow-sm mb-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='w-full'>
            <select
              value={store}
              onChange={(e) => filterByStore(e)}
              className='w-full p-2 border border-gray-300 rounded-lg'
            >
              <option value={0}>Depo Seçiniz</option>
              {stores.map((store, index) => (
                <option key={index} value={store.name}>{store.name}</option>
              ))}
            </select>
          </div>

          {store !== 0 && (
            <div className='w-full'>
              <select
                value={category}
                onChange={(e) => filterByCategories(e)}
                className='w-full p-2 border border-gray-300 rounded-lg'
              >
                <option value="">Kategori Seçiniz</option>
                {cat.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Toplam Sayı */}
      {data && data.length > 0 && (
        <div className='w-full  bg-indigo-600 p-4 rounded-lg shadow-sm mb-4'>
          <p className='text-white font-medium'>
            Toplam {data.length} ürün
          </p>
        </div>
      )}

      {/* Ürün Listesi */}
      {loading ? (
        <div className='w-full flex items-center justify-center p-8'>
          <FaSpinner className='animate-spin text-indigo-600 text-2xl' />
        </div>
      ) : (
        <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {data.map((item) => (
            <div
              key={item.id}
              data-type={item.type}
              data-store={item.store}
              data-category={item.category}
              className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow'
            >
              <img
                src={item.image || 'https://placehold.co/600x400'}
                className='w-full h-48 object-cover rounded-lg mb-4'
                alt={item.name}
              />
              
              <div className='space-y-2'>
                <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                <p className='text-sm text-gray-500'>Barkod: {item.barcode}</p>
                
                <div className='grid grid-cols-2 gap-2 text-center'>
                  <div className='bg-gray-50 p-2 rounded-lg'>
                    <p className='text-sm text-gray-500'>Fiyat</p>
                    <p className='font-semibold'>{item.price} TL</p>
                  </div>
                  <div className='bg-gray-50 p-2 rounded-lg'>
                    <p className='text-sm text-gray-500'>Adet</p>
                    <p className='font-semibold'>{item.count}</p>
                  </div>
                </div>

                <div className='pt-2 border-t border-gray-100'>
                 
                  <p className='text-sm text-gray-500'>Tarih: {item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <span ref={lastCarElementRef} />
    </Container>
  )
}

export default ProductHistory