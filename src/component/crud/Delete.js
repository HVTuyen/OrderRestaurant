import { useState } from "react"
import { Link } from "react-router-dom";

import TextInput from "../input/TextInput"

const Delete =(props) => {
    const handleDelete = () => {
        props.sendData(true)
    };

    console.log(props.item)

    return (
        <>
            <div className='title'>Sửa {props.title}</div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8' style={{borderRadius: '3px', border: '1px solid #333'}}>
                    
                    {props.item.map((item, index) => (
                        <div key={index} className="mb-3 row" style={{ margin: '24px' }}>
                            <label className="col-sm-3 col-form-label">{item.title}</label>
                            <label className="col-sm-9 col-form-label">{item.value}</label>
                        </div>
                    ))}


                    <div className='d-flex j-flex-end' style={{margin: '24px 38px 24px 24px'}}>
                        <button
                            className='btn btn-outline-danger' 
                            style={{marginRight:'6px'}}
                            onClick={handleDelete}
                        >
                            Xóa
                        </button>
                        <Link to={props.url} className='btn btn-outline-danger'>
                            Trở về
                        </Link>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>
        </>
    )
}

export default Delete;