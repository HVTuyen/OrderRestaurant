import clsx from 'clsx'
import {Routes, Route, Link} from 'react-router-dom'
import style from './navbar.module.scss'

import Qlorder from '../content/qlorder/Qlorder'

import Qlbill from '../content/qlbill/Qlbill'

import Category from '../content/category/Category'
import CategoryAdd from '../content/category/CategoryAdd'
import CategoryEdit from '../content/category/CategoryEdit'
import CategoryDelete from '../content/category/CategoryDelete'

import Product from '../content/product/Product'
import ProductAdd from '../content/product/ProductAdd'
import ProductEdit from '../content/product/ProductEdit'
import ProductDelete from '../content/product/ProductDelete'

import Table from '../content/table/Table'
import TableAdd from '../content/table/TableAdd'
import TableEdit from '../content/table/TableEdit'
import TableDelete from '../content/table/TableDelete'

import Employee from '../content/employee/Employee'
import EmployeeAdd from '../content/employee/EmployeeAdd'
import EmployeeDelete from '../content/employee/EmployeeDelete'
import EmployeeEdit from '../content/employee/EmployeeEdit'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'


function Navbar() {

    const classNavbar = clsx(style.navBar,'col-2 bg-secondary')
    const classNavbarUl = clsx('nav flex-column')
    const classTitle = clsx(style.title, 'd-flex')
    const classNavbarIcon = clsx(style.icon)
    const classTitleText = clsx(style.titleText)
    const classNavbarLi = clsx(style.li, 'd-flex')
    const classNavbarA = clsx(style.a)
    const classNavbarIconLI = clsx(style.iconLi)

    return (
        <>
          <div className={classNavbar}>
            <div className={classTitle}>
              <FontAwesomeIcon icon={faUtensils} className={classNavbarIcon}/>
              <h3 className={classTitleText}>Quản lý hoạt động</h3>
            </div>
            <ul className={classNavbarUl}>
            <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Action/Order">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Đơn hàng
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Action/Request">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Yêu cầu
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Action/Table">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Bàn ăn
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Action/ThongKe">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Thống kê, báo cáo
                </Link>
              </li>
            </ul>

            <div className={classTitle}>
              <FontAwesomeIcon icon={faDatabase} className={classNavbarIcon}/>
              <h3 className={classTitleText}>Quản lý dữ liệu</h3>
            </div>
            <ul className={classNavbarUl}>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Category">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Loại món
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Product">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Món ăn
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Table">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Bàn ăn
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Employee">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Nhân viên
                </Link>
              </li>
            </ul>
          </div>
          <Routes>
            <Route path="/Action/Order" element={<Qlorder/>} />

            <Route path="/Action/Bill" element={<Qlbill/>} />

            <Route path="/Category" element={<Category/>} />
            <Route path="/Category/add" element={<CategoryAdd/>} />
            <Route path="/Category/edit/:id" element={<CategoryEdit/>} />
            <Route path="/Category/delete/:id" element={<CategoryDelete/>} />

            <Route path="/Product" element={<Product/>} />
            <Route path="/Product/add" element={<ProductAdd/>} />
            <Route path="/Product/edit/:id" element={<ProductEdit/>} />
            <Route path="/Product/delete/:id" element={<ProductDelete/>} />

            <Route path="/Table" element={<Table/>} />
            <Route path="/Table/add" element={<TableAdd/>} />
            <Route path="/Table/edit/:id" element={<TableEdit/>} />
            <Route path="/Table/delete/:id" element={<TableDelete/>} />

            <Route path="/Employee" element={<Employee/>} />
            <Route path="/Employee/add" element={<EmployeeAdd/>} />
            <Route path="/Employee/edit/:id" element={<EmployeeEdit/>} />
            <Route path="/Employee/delete/:id" element={<EmployeeDelete/>} />
          </Routes>
        </>
        
    )
}

export default Navbar;