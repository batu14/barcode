import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Product from './Pages/AdminPages/Product'
import Panel from './Pages/AdminPages/Panel'
import Store from './Pages/AdminPages/Store'
import Report from './Pages/AdminPages/Report'
import Notification from './Pages/AdminPages/Notification'
import Sales from './Pages/AdminPages/Sales'
import Users from './Pages/AdminPages/Users'
import Profile from './Pages/AdminPages/Profile'
import AddProduct from './Pages/AdminPages/AddProduct'
import Category from './Pages/AdminPages/Category'
import Return from './Pages/AdminPages/Return'
import StoreDetail from './Pages/AdminPages/StoreDetail'
import UpdateProduct from './Pages/AdminPages/UpdateProduct'
import Casualty from './Pages/AdminPages/Casualty'
import Barcode from './Pages/AdminPages/Barcode'
import History from './Pages/AdminPages/History'
import Details from './Pages/AdminPages/Details'
import Daily from './Pages/AdminPages/Daily'
import ProductHistory from './Pages/AdminPages/ProductHistory'
import UserPanel from './Pages/AdminPages/UserPanel'
import ReportPage from './Pages/AdminPages/ReportPage'
import Tick from './Pages/AdminPages/Tick'
import Ticks from './Pages/AdminPages/Ticks'
import List from './Pages/AdminPages/List'
import Statistics from './Pages/AdminPages/Statistics'
import İmportHistory from './Pages/AdminPages/İmportHistory'

const App = () => {
  return (
    <Routes>

      <Route path='/' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} >
        <Route path='/dashboard/userPanel' element={<UserPanel></UserPanel>}></Route>
        <Route path='/dashboard/panel' element={<Panel></Panel>} />
        <Route path='/dashboard/products' element={<Product></Product>} />
        <Route path='/dashboard/store' element={<Store></Store>} />
        <Route path='/dashboard/report' element={<Report></Report>} />
        <Route path='/dashboard/statistics' element={<Statistics></Statistics>} />
        <Route path='/dashboard/reportPage' element={<ReportPage></ReportPage>}></Route>
        <Route path='/dashboard/notification' element={<Notification></Notification>} />
        <Route path='/dashboard/sales' element={<Sales></Sales>} />
        <Route path='/dashboard/tick' element={<Tick></Tick>} />
        <Route path='/dashboard/ticks' element={<Ticks></Ticks>} />
        <Route path='/dashboard/list' element={<List></List>} />
        <Route path='/dashboard/casualty' element={<Casualty></Casualty>} />
        <Route path='/dashboard/users' element={<Users></Users>} />
        <Route path='/dashboard/profile' element={<Profile></Profile>} />
        <Route path='/dashboard/addProduct' element={<AddProduct></AddProduct>}></Route>
        <Route path='/dashboard/updateProduct/:id' element={<UpdateProduct></UpdateProduct>}></Route>
        <Route path='/dashboard/categories' element={<Category></Category>}></Route>
        <Route path='/dashboard/return' element={<Return></Return>}></Route>
        <Route path='/dashboard/storeDetail' element={<StoreDetail></StoreDetail>}></Route>
        <Route path='/dashboard/barcode' element={<Barcode></Barcode>}></Route>
        <Route path='/dashboard/history' element={<History></History>}></Route>
        <Route path='/dashboard/details' element={<Details></Details>}></Route>
        <Route path='/dashboard/daily' element={<Daily></Daily>}></Route>
        <Route path='/dashboard/productsHistory' element={<ProductHistory></ProductHistory>}></Route>
        <Route path='/dashboard/storeHistory' element={<İmportHistory/>}></Route>
        
      </Route>


    </Routes>
  )
}

export default App