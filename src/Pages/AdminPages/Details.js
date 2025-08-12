import React, { useEffect, useState } from 'react'
import Container from '../../Components/Container'
import DataTable from 'react-data-table-component';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'



const Details = () => {

    const [loading, setLoading] = useState(true)

    const [cat, setCat] = useState()
    const [store, setStore] = useState()
    const [sales, setSales] = useState([])
    const [casualty, setCasualty] = useState([])
    const [r, setR] = useState([])
    const [all,setAll]=useState([])



    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const param1 = urlParams.get('c');
        const param2 = urlParams.get('s');
        setCat(param1)
        setStore(param2)

        const formdata = new FormData()
        formdata.append('action', 'selectReturn')
        formdata.append('store', param2)
        formdata.append('category', param1)
        fetch(process.env.REACT_APP_BASE_URL + 'panel.php', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                setR(data)
                setLoading(false)
            })


        const formdata2 = new FormData()
        formdata2.append('action', 'selectSell')
        formdata2.append('store', param2)
        formdata2.append('category', param1)
        fetch(process.env.REACT_APP_BASE_URL + 'panel.php', {
            method: 'POST',
            body: formdata2
        }).then(res => res.json())
            .then(data => {
                setSales(data)
                setLoading(false)
            })
        const formdata3 = new FormData()
        formdata3.append('action', 'selectCasualty')
        formdata3.append('store', param2)
        formdata3.append('category', param1)
        fetch(process.env.REACT_APP_BASE_URL + 'panel.php', {
            method: 'POST',
            body: formdata3
        }).then(res => res.json())
            .then(data => {
                setCasualty(data)
                setLoading(false)
            })
        const formdata4 = new FormData()
        formdata4.append('action', 'details')
        formdata4.append('store', param2)
        formdata4.append('category', param1)
        fetch(process.env.REACT_APP_BASE_URL + 'panel.php', {
            method: 'POST',
            body: formdata4
        }).then(res => res.json())
            .then(data => {
                setAll(data)
                setLoading(false)
            })
    }, [])


    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'İsim',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'barkod',
            selector: row => row.barcode,
            sortable: true,
        },
        {
            name: 'Adet',
            selector: row => row.count,
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


    ];


    const PanelBtn = ({ children }) => {
        return (
            <Tab as="span" className="focus:outline-none">
                {({ selected }) => (
                    <button
                        className={
                            "transition-all duration-200 px-6 py-2 rounded-full font-semibold text-base shadow-sm " +
                            (selected
                                ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg scale-105 ring-2 ring-indigo-300"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-md")
                        }
                        type="button"
                    >
                        {children}
                    </button>
                )}
            </Tab>
        );
    };





    return (
        <Container padding>
            <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Depo</h1>
                    <hr className="h-px w-full bg-gray-200 mb-2" />
                    <span className="text-2xl font-semibold text-indigo-600">{store}</span>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Kategori</h1>
                    <hr className="h-px w-full bg-gray-200 mb-2" />
                    <span className="text-2xl font-semibold text-indigo-600">{cat}</span>
                </div>
            </div>
            <TabGroup className="w-full flex flex-col gap-6">
                <TabList className="w-full flex items-center justify-between gap-6">
                    <div className="w-full flex items-center justify-start gap-4">
                        <PanelBtn>Satış</PanelBtn>
                        <PanelBtn>İade</PanelBtn>
                        <PanelBtn>Zaiat</PanelBtn>
                    </div>
                    <PanelBtn>Hepsi</PanelBtn>
                </TabList>
                <TabPanels className="w-full">
                    <TabPanel>
                        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden p-2">
                            {loading !== true && sales ? (
                                <DataTable
                                    columns={columns}
                                    pagination
                                    data={sales}
                                    customStyles={{
                                        table: { style: { backgroundColor: 'white', borderRadius: '0.5rem' } },
                                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#e2e8f0' } },
                                        headCells: { style: { color: '#64748b', fontSize: '0.875rem', fontWeight: '600', padding: '1rem' } },
                                        cells: { style: { fontSize: '0.875rem', padding: '1rem', color: '#334155' } }
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-40 text-gray-500">Yükleniyor</div>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden p-2">
                            {loading !== true && r ? (
                                <DataTable columns={columns} pagination data={r}
                                    customStyles={{
                                        table: { style: { backgroundColor: 'white', borderRadius: '0.5rem' } },
                                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#e2e8f0' } },
                                        headCells: { style: { color: '#64748b', fontSize: '0.875rem', fontWeight: '600', padding: '1rem' } },
                                        cells: { style: { fontSize: '0.875rem', padding: '1rem', color: '#334155' } }
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-40 text-gray-500">Yükleniyor</div>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden p-2">
                            {loading !== true && casualty ? (
                                <DataTable columns={columns} pagination data={casualty}
                                    customStyles={{
                                        table: { style: { backgroundColor: 'white', borderRadius: '0.5rem' } },
                                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#e2e8f0' } },
                                        headCells: { style: { color: '#64748b', fontSize: '0.875rem', fontWeight: '600', padding: '1rem' } },
                                        cells: { style: { fontSize: '0.875rem', padding: '1rem', color: '#334155' } }
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-40 text-gray-500">Yükleniyor</div>
                            )}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 overflow-hidden p-2">
                            {loading !== true && all ? (
                                <DataTable columns={columns} pagination data={all}
                                    customStyles={{
                                        table: { style: { backgroundColor: 'white', borderRadius: '0.5rem' } },
                                        headRow: { style: { backgroundColor: '#f8fafc', borderBottomWidth: '1px', borderBottomColor: '#e2e8f0' } },
                                        headCells: { style: { color: '#64748b', fontSize: '0.875rem', fontWeight: '600', padding: '1rem' } },
                                        cells: { style: { fontSize: '0.875rem', padding: '1rem', color: '#334155' } }
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-40 text-gray-500">Yükleniyor</div>
                            )}
                        </div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Container>
    )
}

export default Details