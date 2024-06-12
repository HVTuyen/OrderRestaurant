import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { doc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from '../table/table.module.scss'
import { TABLE_API, TABLE_BOOK_SUB, TABLE_CANCEL_BOOK_SUB } from '../../constants'
import { db } from '../../../firebaseConfig';
import ModalBook from '../../../component/Modal/ModalBook';

function Qltable() {
    console.log('re-render-Table')
    const [tables, setTables] = useState([])
    const [tablesSearch, setTablesSearch] = useState([])
    const [table, setTable] = useState('')
    const [render, setRender] = useState(0)
    const [isShowModal, setIsShowModal] = useState('')
    const [id, setId] = useState('')

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

    const ordersRef = collection(db, "table");

    useEffect(() => {
        // Đăng ký hàm callback để lắng nghe sự thay đổi trong collection "orders"
        const unsub = onSnapshot(ordersRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("table: ", change.doc.data());
                    deleteDoc(doc(db, "table", change.doc.id))
                }
            });
            setRender(prevCount => prevCount + 1);
        }, (error) => {
            console.error("Error getting orders:", error);
        });

        return () => unsub(); // Dọn dẹp listener khi component unmount
    }, []);

    const handleShowBook = (id) => {
        setId(id)
        setIsShowModal(true)
    }

    const handleModal = (data) => {
        if (!data) {
            setIsShowModal(false)
        } else {
            handleBook(data)
            setIsShowModal(false)
        }
    }

    const handleBook = (data) => {
        const bookData = {
            id: id,
            note: data
        }
        axios.put(`${TABLE_API}${TABLE_BOOK_SUB}/${id}?note=${data}`)
            .then(res => {
                setRender(prevCount => prevCount + 1);
            })
            .catch(error => {
                console.error('Error booking table:', error);
            });
    }

    const handleCancelBook = (id) => {
        axios.put(`${TABLE_API}${TABLE_CANCEL_BOOK_SUB}/${id}`)
            .then(res => {
                alert('Hủy bàn đặt thành công!')
                setRender(prevCount => prevCount + 1);
            })
            .catch(error => {
                console.error('Error booking table:', error);
            });
    }

    console.log(table)
    console.log(tables)
    console.log(tablesSearch)

    const classTableSearch = clsx(style.tableSearch, 'input-group')
    const classTableButton = clsx(style.tableButton, 'btn btn-outline-primary')
    const classTableButtonPayment = clsx(style.tableButton, 'btn btn-outline-primary')
    const classTableButtonBook = clsx(style.tableButton, 'btn btn-outline-danger')
    const classTableButtonCancelBook = clsx(style.tableButton, 'btn btn-outline-secondary')
    const classTableIcon = clsx(style.tableIcon)
    const classListTables = clsx(style.listTables, 'row')
    const classTableItem = clsx(style.tableItem, 'row')
    const classTable = clsx(style.table, 'col-4')
    const classTableItemIcon = clsx(style.tableItemIcon)
    const classStatusTableItem = clsx(style.statusTableItem)
    const classStatusTableIcon = clsx(style.statusTableIcon)
    const classStatusTableIconPrimary = clsx(style.statusTableIcon, 'primary')
    const classStatusTableIconDanger = clsx(style.statusTableIcon, 'danger')


    let countPrimary = 0;
    let countDanger = 0;
    let count = 0

    return (
        <>
            <div className="col-10">
                <div className='title'>Danh sách bàn ăn</div>
                <div className={classTableSearch}>
                    <input type="text" className="form-control" placeholder="Nhập tên bàn cần tìm..."
                        value={table}
                        onChange={e => setTable(e.target.value)}
                    />
                    <button className={classTableButton} type="button">
                        <FontAwesomeIcon icon={faSearch} className={classTableIcon} style={{ width: '100%' }} />
                    </button>
                </div>

                <div className={classListTables}>
                    <div className='col-1'></div>
                    <div className='col-8'>
                        <div className='row'>
                            {
                                tablesSearch.map((item) => {

                                    let classStatus;
                                    switch (item.code) {
                                        case 1:
                                            classStatus = ' ';
                                            count++;
                                            break;
                                        case 2:
                                            classStatus = ' primary';
                                            countPrimary++;
                                            break;
                                        default:
                                            classStatus = ' danger';
                                            countDanger++;
                                    }

                                    return (
                                        <div key={item.tableId} className={classTable}>
                                            <div className={classTableItem + classStatus}>
                                                <div className='col-3 d-flex a-center' style={{ padding: '0 4px' }}>
                                                    <img loading='lazy' src={item.urlImage} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />
                                                </div>
                                                <div className='col-6 d-flex a-center flex-column j-center' style={{ padding: '0 4px' }}>
                                                    <div>{item.name}</div>
                                                    {
                                                        item.code === 3 ? (
                                                            <>
                                                                <div style={{ fontSize: '12px' }}>{item.note.split(',')[0]}</div>
                                                                <div style={{ fontSize: '12px' }}>{item.note.split(',')[1]}</div>
                                                            </>
                                                        ) : null
                                                    }
                                                </div>
                                                <div className='col-3 d-flex a-center' style={{ padding: '0 4px' }}>
                                                    <div style={{ width: '100%' }}>
                                                        {
                                                            item.code == 2 && (
                                                                <Link to={`/Ql/Action/Table/${item.tableId}`} className={classTableButtonPayment} style={{ fontSize: '12px', width: '100%', padding: '4px' }}>Hóa đơn</Link>
                                                            )
                                                        }
                                                        {
                                                            item.code == 1 && (
                                                                <button
                                                                    className={classTableButtonBook}
                                                                    style={{ fontSize: '12px', width: '100%', padding: '4px' }}
                                                                    onClick={() => handleShowBook(item.tableId)}
                                                                >
                                                                    Đặt bàn
                                                                </button>
                                                            )
                                                        }
                                                        {
                                                            item.code == 3 && (
                                                                <button
                                                                    className={classTableButtonCancelBook}
                                                                    style={{ fontSize: '12px', width: '100%', padding: '4px' }}
                                                                    onClick={() => handleCancelBook(item.tableId)}
                                                                >
                                                                    Hủy đặt
                                                                </button>
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
                    <div className='col-2' style={{ border: '1px solid #333', borderRadius: '6px', height: '280px' }}>
                        <div className={classStatusTableItem}>
                            <div className='d-flex a-center' style={{ margin: '12px 6px 6px 12px' }}>
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
                            <div className='d-flex a-center' style={{ margin: '12px 6px 6px 12px' }}>
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
                            <div className='d-flex a-center' style={{ margin: '12px 6px 6px 12px' }}>
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
                {
                    isShowModal && (
                        <ModalBook
                            handleModal={handleModal}
                            title='Đặt bàn'
                        />
                    )
                }
            </div>
        </>
    )
}


export default Qltable;