import clsx from 'clsx'
import {Routes, Route, Link} from 'react-router-dom'
import style from './navbar.module.scss'

import Category from '../content/category/Category'
import Product from '../content/product/Product'
import Table from '../content/table/Table'
import Employee from '../content/employee/Employee'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'


function Navbar() {

    const classNavbar = clsx(style.navBar,'col-2 border bg-secondary')
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
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/content">Active</Link>
              </li>
              <li className={classNavbarLi}>
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/content">Active</Link>
              </li>
              <li className={classNavbarLi}>
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/content">Active</Link>
              </li>
            </ul>

            <div className={classTitle}>
              <FontAwesomeIcon icon={faDatabase} className={classNavbarIcon}/>
              <h3 className={classTitleText}>Quản lý dữ liệu</h3>
            </div>
            <ul className={classNavbarUl}>
              <li className={classNavbarLi}>
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/Category">Loại món</Link>
              </li>
              <li className={classNavbarLi}>
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/Product">Món ăn</Link>
              </li>
              <li className={classNavbarLi}>
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/Table">Bàn ăn</Link>
              </li>
              <li className={classNavbarLi}>
                <FontAwesomeIcon icon={faCircle} className={classNavbarIconLI}/>
                <Link className={classNavbarA} to="/Employee">Nhân viên</Link>
              </li>
            </ul>
          </div>
          <Routes>
            <Route path="/category" element={<Category/>} />
            <Route path="/product" element={<Product/>} />
            <Route path="/table" element={<Table/>} />
            <Route path="/employee" element={<Employee/>} />
          </Routes>
        </>
        
    )
}

export default Navbar;