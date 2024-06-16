import clsx from 'clsx'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { TABLE_TITLE, TABLE_TYPE } from '../../constants'
import { storage } from '../../../firebaseConfig';
import { renewToken } from '../../../CallApi/renewToken'
import { useAuth } from '../../../component/Context/AuthProvider';
import Update from '../../../component/crud/Update';
import { getTable } from '../../../CallApi/TableApi/getTable'

function TableEdit() {
    const { account, token, refreshToken, reNewToken } = useAuth();

    const { id } = useParams()
    console.log(id)

    const navigate = useNavigate();

    const [table, setTable] = useState({})

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
                console.error('Error fetching table');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="col-10">
            <Update
                id={id}
                type={TABLE_TYPE}
                url='/Ql/Table'
                title={TABLE_TITLE}
                item={
                    [
                        {
                            title: 'Tên bàn',
                            name: 'name',
                            value: table.name,
                            type: 'Text',
                        },
                        {
                            title: 'Ảnh QR',
                            name: 'image',
                            value: table.urlImage,
                            type: 'Image',
                        }
                    ]
                }
            />
        </div>
    )
}

export default TableEdit;