import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { TABLE_TITLE } from '../../constants'
import { getTable } from '../../../CallApi/TableApi/getTable'
import { deleteTable } from '../../../CallApi/TableApi/deleteTable'
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Delete from '../../../component/crud/Delete'

// function TableDelete( ) {

//     const navigate = useNavigate();

//     const {id} = useParams()
//     console.log(id)

//     const [table,setTable] = useState('')

//     useEffect(() => {
//         axios.get(`${TABLE_API}${id}`)
//             .then(res => {
//                 setTable(res.data)
//             })
//             .catch(error => {
//                 console.error('Error fetching table:', error);
//             });
//     }, [])

//     const deleteTable = async () => {
//         axios.delete(`${TABLE_API}${id}`)
//             .then(() => {
//                 console.log('Table deleted successfully');
//                 navigate('/Ql/Table');
//             })
//             .catch(error => {
//                 console.error('Error delete Table:', error);
//             });
//     }

//     console.log(table)
    
//     return (
//         <div className="col-10">
//             <div className='title'>Xóa bàn ăn</div>
//             <div className='row'>
//                 <div className='col-2'></div>
//                 <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Ảnh QR</label>
//                         <img className="col-sm-4" src={table.qR_id} alt={table.tableName} height="100%"/>
//                     </div>
//                     <div className="mb-3 row" style={{margin: '24px'}}>
//                         <label className="col-sm-3 col-form-label">Tên bàn</label>
//                         <label className="col-sm-9 col-form-label">{table.tableName}</label>
//                     </div>
//                     <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
//                         <button 
//                             className='btn btn-outline-danger' 
//                             style={{marginRight:'6px'}}
//                             onClick={deleteTable}
//                         >
//                             Xác nhận xóa
//                         </button>
//                         <Link to='/Ql/Table' className='btn btn-outline-danger'>
//                             Trở về
//                         </Link>
//                     </div>
//                 </div>
//                 <div className='col-2'></div>
//             </div>
//         </div>
//     )
// }

function TableDelete( ) {

    const navigate = useNavigate();

    const { account, token, refreshToken, reNewToken } = useAuth();

    const {id} = useParams()
    console.log(id)

    const [table,setTable] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const response = await getTable(config, id);
            if (response && response.data) {
                setTable(response.data);
            } else if (response && response.error === 'Unauthorized') {
                try {
                    const { accessToken, refreshToken } = await renewToken(oldtoken, navigate);
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    reNewToken(accessToken, refreshToken);
                    const newconfig = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    };
                    const newDataResponse = await getTable(newconfig, id);
                    if (newDataResponse && newDataResponse.data) {
                        setTable(newDataResponse.data);
                    } else {
                        console.error('Error fetching table after token renewal');
                    }
                } catch (error) {
                    console.error('Error renewing token:', error);
                }
            } else {
                console.error('Error fetching table:', response.error || 'Unknown error');
            }
        };
        fetchData();
    }, []);

    const handleDataFromDelete = async (check) => {
        if(check) {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const oldtoken = {
                accessToken: token,
                refreshToken: refreshToken
            };
            const response = await deleteTable(config, id);
            if (response) {
                navigate('/Ql/Table/')
            } else {
                if (response && response.error === 'Unauthorized') {
                    try {
                        const { accessToken, refreshToken } = await renewToken(oldtoken, navigate);
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        reNewToken(accessToken, refreshToken);
                        const newconfig = {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        };
                        const newDataResponse = await deleteTable(newconfig, id);
                        if (newDataResponse) {
                            navigate('/Ql/Table/')
                        } else {
                            console.error('Error delete Table after token renewal');
                        }
                    } catch (error) {
                        console.error('Error renewing token:', error);
                    }
                } else {
                    console.error('Error delete Table');
                }
            }
        }
    }
    
    return (
        <div className="col-10">
            <Delete
                url='/Ql/Table'
                title={TABLE_TITLE}
                item={
                    [
                        {
                            title: 'Tên bàn',
                            name: 'name',
                            value: table.tableName,
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh QR',
                            name: 'image',
                            value: table.qR_id,
                            type: 'Image',
                        }
                    ]
                }
                sendData={handleDataFromDelete} 
            />
        </div>
    )
}

export default TableDelete;