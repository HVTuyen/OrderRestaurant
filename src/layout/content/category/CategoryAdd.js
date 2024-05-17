import clsx from 'clsx'
import {Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { CATEGORY_API,  CATEGORY_TITLE, CATEGORY_TYPE} from '../../constants'
import { useAuth } from '../../../component/Context/AuthProvider';

import Create from '../../../component/crud/Create';

function CategoryAdd( ) {
    return (
        <div className="col-10">

            <Create
                type={CATEGORY_TYPE}
                url='/Ql/Category'
                title={CATEGORY_TITLE}
                item={
                    [
                        {
                            title: 'Tên loại món',
                            name: 'name',
                            type: 'Text',
                        },
                        {
                            title: 'Mô tả',
                            name: 'description',
                            type: 'Text',
                        }
                    ]
                }
            />
        </div>
    )
}

export default CategoryAdd;