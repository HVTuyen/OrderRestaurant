import clsx from 'clsx'
import {Routes, Route, Link} from 'react-router-dom'
import { useState, useEffect } from 'react'

import style from './navbar.module.scss'

import Qlorder from '../content/qlorder/Qlorder'
import QlorderDetail from '../content/qlorder/QlorderDetail'

import Qlbill from '../content/qlbill/Qlbill'

import Qlrequest from '../content/qlrequest/Qlrequest'
import QlrequestDetail from '../content/qlrequest/QlrequestDetail'

import Qltable from '../content/qltable/Qltable'

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
import { faDatabase, faUtensils, faMoneyBillTrendUp, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'


function Navbar() {

    const classNavbar = clsx(style.navBar,'col-2 bg-secondary')
    const classNavbarSub = clsx(style.navBarSub,'col-2 bg-secondary')
    const classNavbarUl = clsx('nav flex-column')
    const classTitle = clsx(style.title, 'd-flex')
    const classNavbarIcon = clsx(style.icon)
    const classTitleText = clsx(style.titleText)
    const classNavbarLi = clsx(style.li, 'd-flex')
    const classNavbarA = clsx(style.a)
    const classNavbarIconLI = clsx(style.iconLi)
    const classMenuBarsIcon = clsx(style.menuBarsIcon, 'btn btn-outline-secondary')
    const classBtnCloseNav = clsx(style.menuBarsIconClose)

    const [isShow, setIsShow] = useState(false)
    
    useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth > 1000) {
              setIsShow(false);
          }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
          window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
        <>
          <div className={classNavbar}>
            <div className={classTitle}>
              <FontAwesomeIcon icon={faUtensils} className={classNavbarIcon}/>
              <h3 className={classTitleText}>Quản lý hoạt động</h3>
            </div>
            <ul className={classNavbarUl}>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Action/Order">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Đơn hàng
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Action/Request">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Yêu cầu
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Action/Table">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Bàn ăn
                </Link>
              </li>
            </ul>

            <div className={classTitle}>
              <FontAwesomeIcon icon={faDatabase} className={classNavbarIcon}/>
              <h3 className={classTitleText}>Quản lý dữ liệu</h3>
            </div>
            <ul className={classNavbarUl}>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Category">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Loại món
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Product">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Món ăn
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Table">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Bàn ăn
                </Link>
              </li>
              <li className={classNavbarLi}>
                <Link className={classNavbarA} to="/Ql/Employee">
                  <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                  Nhân viên
                </Link>
              </li>
            </ul>
            <Link className={classTitle}>
              <FontAwesomeIcon icon={faMoneyBillTrendUp} className={classNavbarIcon}/>
              <h3 className={classTitleText}>Thống kê</h3>
            </Link>
          </div>
          <div className={classMenuBarsIcon} onClick={() => setIsShow(true)}>
            <FontAwesomeIcon icon={faBars} className={classNavbarIcon}/>
          </div>
          {
            isShow && (
              <>
                <div className={classNavbarSub}>
                  <div className={classTitle}>
                    <FontAwesomeIcon icon={faUtensils} className={classNavbarIcon}/>
                    <h3 className={classTitleText}>Quản lý hoạt động</h3>
                  </div>
                  <ul className={classNavbarUl}>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Action/Order">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Đơn hàng
                      </Link>
                    </li>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Action/Request">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Yêu cầu
                      </Link>
                    </li>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Action/Table">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Bàn ăn
                      </Link>
                    </li>
                  </ul>

                  <div className={classTitle}>
                    <FontAwesomeIcon icon={faDatabase} className={classNavbarIcon}/>
                    <h3 className={classTitleText}>Quản lý dữ liệu</h3>
                  </div>
                  <ul className={classNavbarUl}>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Category">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Loại món
                      </Link>
                    </li>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Product">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Món ăn
                      </Link>
                    </li>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Table">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Bàn ăn
                      </Link>
                    </li>
                    <li className={classNavbarLi}>
                      <Link className={classNavbarA} to="/Ql/Employee">
                        <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                        Nhân viên
                      </Link>
                    </li>
                  </ul>
                  <Link className={classTitle}>
                    <FontAwesomeIcon icon={faMoneyBillTrendUp} className={classNavbarIcon}/>
                    <h3 className={classTitleText}>Thống kê</h3>
                  </Link>
                </div>
                <div className={classBtnCloseNav} onClick={() => setIsShow(false)}>
                  <FontAwesomeIcon icon={faXmark} className={classNavbarIcon}/>
                </div>
              </>
            )
          }
          <Routes>
            <Route path="/Action/Order" element={<Qlorder/>} />
            <Route path="/Action/Order/:id" element={<QlorderDetail/>} />

            <Route path="/Action/Bill" element={<Qlbill/>} />

            <Route path="/Action/Request" element={<Qlrequest/>} />
            <Route path="/Action/Request/:id" element={<QlrequestDetail/>} />

            <Route path='/Action/Table' element={<Qltable/>} />

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