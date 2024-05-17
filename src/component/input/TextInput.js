import { useState, useEffect } from "react";

const TextInput = (props) => {
    const [data, setData] = useState(props.value ? props.value : '')

    useEffect(() => {
        setData(props.value);
        if (props.sendData) {
            props.sendData(props.name, props.value);
        }
    }, [props.value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setData(newValue);
        if (props.sendData) {
            props.sendData(props.name, newValue);
        }
    };

    return (
        <>
            <label className="col-sm-3 col-form-label">{props.title}</label>
            <div className="col-sm-9">
                <input 
                    type={props.type} 
                    className="form-control"
                    value={data}
                    onChange={(e) => handleChange(e)}
                />
            </div>
        </>
    )
}

export default TextInput;