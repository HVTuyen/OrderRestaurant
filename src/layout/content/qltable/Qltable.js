import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from '../table/table.module.scss'
import { TABLE_API } from '../../constants'
import { db } from '../../../firebaseConfig';

function Qltable() {
    console.log('re-render-Table')
    const [tables,setTables] = useState([])
    const [tablesSearch,setTablesSearch] = useState([])
    const [table,setTable] = useState('')
    const [render, setRender] = useState(0)

    useEffect(() => {
        axios.get(TABLE_API)
            .then(res => {
                setTables(res.data);
                setTablesSearch(res.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, [render])

    useEffect(() => {
        setTablesSearch(table ? tables.filter(item => item.tableName.includes(table)) : tables);
    }, [table])

    const ordersRef = collection(db, "orders");

    useEffect(() => {
        // Đăng ký hàm callback để lắng nghe sự thay đổi trong collection "orders"
        const unsub = onSnapshot(ordersRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("orders: ", change.doc.data());
                }
            });
                setRender(prevCount => prevCount + 1);
        }, (error) => {
            console.error("Error getting orders:", error);
        });
    
        return () => unsub(); // Dọn dẹp listener khi component unmount
    }, []);
    
    console.log(table)
    console.log(tables)
    console.log(tablesSearch)

    const classTableSearch = clsx(style.tableSearch, 'input-group')
    const classTableButton = clsx(style.tableButton, 'btn btn-outline-primary')
    const classTableButtonPayment = clsx(style.tableButton, 'btn btn-outline-primary')
    const classTableButtonBook = clsx(style.tableButton, 'btn btn-outline-danger')
    const classTableIcon = clsx(style.tableIcon)
    const classListTables = clsx(style.listTables ,'row')
    const classTableItem = clsx(style.tableItem, 'row')
    const classTable = clsx(style.table, 'col-4')
    const classTableItemIcon = clsx(style.tableItemIcon)
    const classStatusTableItem = clsx(style.statusTableItem)
    const classStatusTableIcon = clsx(style.statusTableIcon)
    const classStatusTableIconPrimary = clsx(style.statusTableIcon, 'primary')
    const classStatusTableIconDanger = clsx(style.statusTableIcon, 'danger')

    
    let countPrimary=0;
    let countDanger=0;
    let count=0


    return (
        <div className="col-10">
            <div className='title'>Danh sách bàn ăn</div>
            <div className={classTableSearch}>
                <input type="text" className="form-control" placeholder="Nhập tên bàn cần tìm..." 
                    value={table}
                    onChange={e => setTable(e.target.value)}
                />
                <button className={classTableButton} type="button">
                    <FontAwesomeIcon icon={faSearch} className={classTableIcon} style={{width: '100%'}}/>
                </button>
            </div>

            <div className={classListTables}>
                <div className='col-1'></div>
                <div className='col-8'>
                    <div className='row'>
                        {
                            tablesSearch.map((item) => { 
                                
                                let classStatus;
                                switch(item.code) {
                                    case 1:
                                        classStatus = ' ';
                                        countDanger++;
                                        break;
                                    case 2:
                                        classStatus = ' primary';
                                        countPrimary++;
                                        break;
                                    default:
                                        classStatus = ' danger';
                                        count++;
                                }

                                return (
                                    <div key={item.tableId} className={classTable}>
                                        <div className={classTableItem + classStatus}>
                                            <div className='col-3' style={{maxHeight:'42px', padding:'0 4px'}}>
                                                <img loading='lazy' src={item.qR_id} alt={item.title} style={{width:'100%', borderRadius:'8px'}}/>
                                            </div>
                                            <div className='col-4 d-flex a-center' style={{padding:'0 4px'}}>
                                                <div>{item.tableName}</div>
                                            </div>
                                            <div className='col-5 d-flex a-center' style={{padding:'0 4px'}}>
                                                <div style={{width:'100%'}}>
                                                    {
                                                        item.code == 2 && (
                                                            <button className={classTableButtonPayment} style={{fontSize:'12px', width:'100%', padding:'4px'}}>Thanh toán</button>
                                                        )
                                                    }
                                                    {
                                                        item.code == 1 && (
                                                            <button className={classTableButtonBook} style={{fontSize:'12px', width:'100%', padding:'4px'}}>Đặt bàn</button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='col-2' style={{border:'1px solid #333', borderRadius:'6px', height:'276px'}}>
                    <div className={classStatusTableItem}>
                        <div className='d-flex a-center' style={{margin: '12px 6px 6px 12px'}}>
                            <div className={classStatusTableIcon}></div>
                            <div>
                                Bàn trống
                            </div>
                        </div>
                        <div className='d-flex j-center border'>
                            Số lượng bàn: {count}
                        </div>
                    </div>
                    <div className={classStatusTableItem}>
                        <div className='d-flex a-center' style={{margin: '12px 6px 6px 12px'}}>
                            <div className={classStatusTableIconDanger}></div>
                            <div>
                                Bàn đã đặt
                            </div>
                        </div>
                        <div className='d-flex j-center border'>
                            Số lượng bàn: {countDanger}
                        </div>
                    </div>
                    <div className={classStatusTableItem}>
                        <div className='d-flex a-center' style={{margin: '12px 6px 6px 12px'}}>
                            <div className={classStatusTableIconPrimary}></div>
                            <div>
                                Bàn có khách
                            </div>
                        </div>
                        <div className='d-flex j-center border'>
                            Số lượng bàn: {countPrimary}
                        </div>
                    </div>
                </div>
                <div className='col-1'></div>
            </div>
        </div>
    )
}


export default Qltable;