import clsx from 'clsx'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react'
import customParseFormat from 'dayjs/plugin/customParseFormat';

import style from './Modal.module.scss'

dayjs.extend(customParseFormat);

const ModalBook = (props) => {

    const modal = clsx(style.modal)
    const container = clsx(style.container)
    const [name, setName] = useState('')
    const [time, setTime] = useState(dayjs())
    const [errors, setErrors] = useState([])

    const handleBook = () => {
        if (name && time) {
            props.handleModal(`${name},${time.format('DD/MM HH:mm')}`)
        }
        if (!name) {
            setErrors(prevErrors => [...prevErrors, 'name'])
        }
        if (!time) {
            setErrors(prevErrors => [...prevErrors, 'time'])
        }
    }

    // console.log(time.format('DD/MM HH:mm'))

    return (
        <div className={modal}>
            <div className={container}>
                <div style={{ padding: '24px' }}>
                    <div className="modal-header" style={{ marginBottom: '16px' }}>
                        <h2>{props.title}!</h2>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Chọn ngày và giờ"
                            value={time}
                            onChange={(newValue) => setTime(newValue)}
                            format="DD/MM/YYYY HH:mm"
                        />
                    </LocalizationProvider>
                    {
                        errors.includes('time') && !name && (
                            <label className="error">Không được để trống thời gian đặt</label>
                        )
                    }
                    <div style={{ marginTop: '16px' }}>
                        <label className="form-label">Tên khách hàng</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên khách hàng..."
                            value={name}
                            onChange={e => {
                                setName(e.target.value)
                            }}
                        />
                    </div>
                    {
                        errors.includes('name') && !name && (
                            <label className="error">Không được để trống tên khách hàng</label>
                        )
                    }

                    <div className="modal-footer j-center" style={{ margin: '32px 4px 0 4px' }}>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            style={{ marginRight: '2px', minWidth: '100px' }}
                            onClick={handleBook}
                        >
                            Xác nhận
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            style={{ marginLeft: '2px', minWidth: '100px' }}
                            onClick={() => props.handleModal(false)}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalBook;