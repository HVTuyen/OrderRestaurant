import clsx from 'clsx'
import {Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'


function EmployeeAdd( ) {
    
    return (
        <div className="col-10">
            <div className='title'>Thêm nhân viên</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Tên nhân viên</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control"/>
                        </div>
                    </div>
                    <div className="mb-3 row" style={{margin: '24px'}}>
                        <label className="col-sm-3 col-form-label">Ảnh</label>
                        <div className="col-sm-9">
                            <input className="form-control" type="file" />
                        </div>
                    </div>
                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <Link to='/Employee' className='btn btn-outline-primary' style={{marginRight:'6px'}}>
                            Lưu
                        </Link>
                        <Link to='/Employee' className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </div>
    )
}

export default EmployeeAdd;