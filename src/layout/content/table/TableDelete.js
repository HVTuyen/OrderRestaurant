import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { TABLE_API } from '../constants'

function TableDelete( ) {

    const navigate = useNavigate();

    const {id} = useParams()
    console.log(id)

    const [table,setTable] = useState('')

    useEffect(() => {
        axios.get(`${TABLE_API}${id}`)
            .then(res => {
                setTable(res.data)
            })
            .catch(error => {
                console.error('Error fetching table:', error);
            });
    }, [])

    const deleteTable = async () => {
        axios.delete(`${TABLE_API}${id}`)
            .then(() => {
                console.log('Table deleted successfully');
                navigate('/Table');
            })
            .catch(error => {
                console.error('Error delete Table:', error);
            });
    }

    console.log(table)
    
    return (
        <div className="col-10">
            <div className='title'>Xóa bàn ăn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh QR</label>
                        <img className="col-sm-4" src={table.qR_id} alt={table.tableName} height="100%"/>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên bàn</label>
                        <label className="col-sm-9 col-form-label">{table.tableName}</label>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={deleteTable}
                        >
                            Xác nhận xóa
                        </button>
                        <Link to='/Table' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default TableDelete;