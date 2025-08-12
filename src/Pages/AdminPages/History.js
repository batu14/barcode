import React, { useEffect, useState } from 'react'
import Container from '../../Components/Container'
import DataTable from 'react-data-table-component';


const History = () => {
    const [data, setData] = useState()
    const [pending, setPending] = useState(true)
    useEffect(() => {
        const formdata = new FormData()
        formdata.append('action', 'select')
        fetch(process.env.REACT_APP_BASE_URL + 'sales.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => { setData(data[0]) })
            .then(setPending(false))
    }, [])

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Resim',
            cell: row => <div style={{backgroundImage:`url(${row.image})`}} className='w-56 bg-center bg-cover aspect-square'></div>
        },
        {
            name: 'Kategori',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'İsim',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Tarih',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Fiyat',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Maliyet',
            selector: row => row.cost,
            sortable: true,
        },
        {
            name: 'Adet',
            selector: row => row.count,
            sortable: true,
        },
        {
            name: 'Kullanıcı',
            selector: row => row.user,
            sortable: true,
        },

    ];
    return (
        <Container>
            <div className='w-full flex items-start justify-start'>
                <h1 className='text-2xl font-semibold text-gray-700'>Satış Geçmişi</h1>
            </div>
            <DataTable
                columns={columns}
                data={data}
                pagination
                progressPending={pending}



            />

        </Container>
    )
}

export default History