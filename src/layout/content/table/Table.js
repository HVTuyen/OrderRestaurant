import clsx from 'clsx'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import style from './table.module.scss'
import { height, width } from '@fortawesome/free-brands-svg-icons/fa42Group'

function Table() {
    console.log('re-render-Table')
    const [tables,setTables] = useState([])
    const [tablesSearch,setTablesSearch] = useState([])
    const [table,setTable] = useState('')

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then(data => {
                setTables(data.slice(0, 100))
                setTablesSearch(data.slice(0, 100))
            })
    }, [])

    useEffect(() => {
        setTablesSearch(table ? tables.filter(item => item.title.includes(table)) : tables);
    }, [table])
    
    console.log(table)
    console.log(tables)
    console.log(tablesSearch)

    const classTableSearch = clsx(style.tableSearch, 'input-group')
    const classTableButton = clsx(style.tableButton, 'btn btn-outline-primary')
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
                <Link className={classTableButton} to='/Table/Add'>
                    <FontAwesomeIcon icon={faPlus} className={classTableIcon}/>
                    Thêm
                </Link>
            </div>

            <div className={classListTables}>
                <div className='col-1'></div>
                <div className='col-8'>
                    <div className='row'>
                        {
                            tablesSearch.map((item) => { 
                                
                                let classStatus;
                                switch(item.userId) {
                                    case 1:
                                        classStatus = ' danger';
                                        countDanger++;
                                        break;
                                    case 2:
                                        classStatus = ' primary';
                                        countPrimary++;
                                        break;
                                    default:
                                        classStatus = ' ';
                                        count++;
                                }

                                return (
                                    <div className={classTable}>
                                        <div className={classTableItem + classStatus}>
                                            <div className='col-3'>
                                                <img src={'https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSh-wrQu254qFaRcoYktJ5QmUhmuUedlbeMaQeaozAVD4lh4ICsGdBNubZ8UlMvWjKC'} alt={item.title} style={{width:'100%', borderRadius:'8px'}}/>
                                            </div>
                                            <div className='col-6 d-flex a-center'>
                                                <div> Bàn số {item.id}</div>
                                            </div>
                                            <div className='col-3 d-flex a-center'>
                                                <Link to={`/Table/Edit/${item.id}`}>
                                                    <FontAwesomeIcon icon={faEdit} className={classTableItemIcon} style={{color:'#5c94ff'}}/>
                                                </Link>
                                                <Link to={`/Table/Delete/${item.id}`}>
                                                    <FontAwesomeIcon icon={faTrash} className={classTableItemIcon} style={{color:'#ff5252'}}/>
                                                </Link>
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


export default Table;