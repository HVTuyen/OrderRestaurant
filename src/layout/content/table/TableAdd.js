import clsx from 'clsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { TABLE_TITLE, TABLE_TYPE } from '../../constants'
import { storage } from '../../../firebaseConfig';
import Create from '../../../component/crud/Create';
import { useAuth } from '../../../component/Context/AuthProvider';
import { renewToken } from '../../../CallApi/renewToken'

function TableAdd() {

    const { account, token, refreshToken, reNewToken } = useAuth();

    return (
        <div className="col-10">
            <Create
                type={TABLE_TYPE}
                url='/Ql/Table'
                title={TABLE_TITLE}
                item={
                    [
                        {
                            title: 'Tên bàn ăn',
                            name: 'name',
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh',
                            name: 'image',
                            type: 'Image',
                        }
                    ]
                }
            />
        </div>
    )
}

export default TableAdd;