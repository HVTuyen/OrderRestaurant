import { useState, useEffect } from "react";

const TextInput = (props) => {
    const [data, setData] = useState(props.value ? props.value : '')

    useEffect(() => {
        setData(props.value);
        if (props.sendData) {
            props.sendData(props.name, props.value);
        }
    }, [props.value]);

    //Xử lý ảnh
    const [image, setImage] = useState(null);
    const [previewImg, setPreviewImg] = useState('')

    useEffect(() => {
        return () => {
            previewImg && URL.revokeObjectURL(previewImg.preview)
        }
    }, [previewImg])

    const handleChange = (e) => {
        const img = e.target.files[0]
        setData(img)
        if (img) {
            setImage(img);
            img.preview = URL.createObjectURL(img)
            setPreviewImg(img)
        }
        if (props.sendData) {
            props.sendData(props.name, img);
        }
    };

    return (
        <>
            <label className="col-sm-3 col-form-label">Ảnh</label>
            <div className="col-sm-6">
                <input
                    type="file"
                    className="form-control"
                    onChange={e => handleChange(e)}
                />
            </div>
            <div className="col-sm-3">
                {previewImg && data && (
                    <img src={previewImg.preview} style={{width: '100%', height: '100%'}}/>
                )}
                {!previewImg && data && (
                    <img src={data} style={{width: '100%', height: '100%'}}/>
                )}
            </div>
        </>
    )
}

export default TextInput;