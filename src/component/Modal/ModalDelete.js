import clsx from 'clsx'

import style from './Modal.module.scss'

const ModalDelete = (props) => {

    const modal = clsx(style.modal)
    const container = clsx(style.container)

    return (
        <div className={modal}>
            <div className={container}>
                <div style={{ padding: '24px' }}>
                    <div className="modal-header">
                        <h2>Xác nhận xóa {props.title}!</h2>
                    </div>
                    <div className="modal-body">
                        Bạn có chắc là muốn xóa {props.title} không?
                    </div>
                    <div className="modal-footer j-center" style={{margin:'32px 4px 0 4px'}}>
                        
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            style={{marginRight:'2px', minWidth:'100px'}}
                            onClick={() => props.handleModal(true)}
                        >
                            Xóa
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            style={{marginLeft:'2px', minWidth:'100px'}}
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

export default ModalDelete;