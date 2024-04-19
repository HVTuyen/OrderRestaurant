import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { TABLE_API } from '../constants'

function TableAdd( ) {

    const [tableName,setTableName] = useState('')
    const [image,setImage] = useState('')
    const [previewImg,setPreviewImg] = useState('')

    console.log(tableName, image)

    const createTable = async () => {
        const formData = new FormData();
        formData.append('tableName', tableName);
        formData.append('qR_id', image);

        try {
            await axios.post(TABLE_API, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Table created successfully.');
            // Redirect or handle success
            window.location.href = '/Table';
        } catch (error) {
            console.error('Error creating Table:', error);
            // Handle error
        }
    };

    useEffect(() => {
        return () => {
            previewImg && URL.revokeObjectURL(previewImg.preview)
        }
    }, [previewImg])

    const handleImg = (e) => {
        const img = e.target.files[0]
        console.log(typeof img)
        setImage(img)
        img.preview = URL.createObjectURL(img)
        setPreviewImg(img)
    }
    
    return (
        <div className="col-10">
            <div className='title'>Thêm bàn ăn</div>
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
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <div className="col-sm-6">
                            <input 
                                type="file" 
                                className="form-control"    
                                onChange={handleImg}
                            />
                        </div>
                        <div className="col-sm-3">
                            {previewImg && (
                                <img src={previewImg.preview} style={{width: '100%', height: '100%'}}/>
                            )}
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link 
                            to='/Table' 
                            className='btn btn-outline-primary' 
                            style={{marginRight:'6px'}}
                            onClick={createTable}
                        >
                            Lưu
                        </Link>
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

export default TableAdd;