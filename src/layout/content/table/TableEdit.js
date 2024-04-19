import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { TABLE_API } from '../constants'

function TableEdit( ) {
    const {id} = useParams()
    console.log(id)

    const [tableName,setTableName] = useState('')
    const [qR_id,setQR_id] = useState('')
    const [previewImg,setPreviewImg] = useState('')
    const [statusId,setStatusId] = useState('')
    const [note,setNote] = useState('')

    useEffect(() => {
        axios.get(`${TABLE_API}${id}`)
            .then(res => {
                setTableName(res.data.tableName)
                setPreviewImg(res.data.qR_id)
                setStatusId(res.data.statusId)
                setNote(res.data.note)
            })
            .catch(error => {
                console.error('Error fetching table:', error);
            });
    }, [])

    console.log(tableName, statusId, note, qR_id)

    useEffect(() => {
        return () => {
            previewImg && URL.revokeObjectURL(previewImg.preview)
        }
    }, [previewImg])

    const handleImg = (e) => {
        const img = e.target.files[0]
        setQR_id(img)
        img.preview = URL.createObjectURL(img)
        setPreviewImg(img)
    }

    const updateTable = async () => {
        const formData = new FormData();
        formData.append('tableName', tableName);
        formData.append('qR_id', qR_id);
        formData.append('statusId', statusId);
        formData.append('note', note);

        try {
            await axios.put(`${TABLE_API}${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Table update successfully.');
            window.location.href = '/Table';
        } catch (error) {
            console.error('Error update Table:', error);
            // Handle error
        }
    }
    
    return (
        <div className="col-10">
            <div className='title'>Chỉnh sửa bàn ăn</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên bàn</label>
                        <div className="col-sm-9">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={tableName}
                                onChange={e => setTableName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh QR</label>
                        <div className="col-sm-6">
                            <input 
                                type="file" 
                                className="form-control"    
                                onChange={handleImg}
                            />
                        </div>
                        <div className="col-sm-3">
                            {previewImg && (
                                <img src={qR_id=='' ? `data:image/jpeg;base64,${previewImg}` : previewImg.preview} style={{width: '100%', height: '100%'}}/>
                            )}
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={updateTable}
                        >
                            Lưu
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

export default TableEdit;