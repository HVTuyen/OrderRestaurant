import { useState, useEffect } from "react";

const SelectInput = (props) => {
    const [options, setOptions] = useState(props.options ? props.options : []);
    const [data, setData] = useState(props.value ? props.value : '')

    useEffect(() => {
        setOptions(props.options);
        setData(props.value);
        if (props.sendData) {
            props.sendData(props.name, props.value);
        }
        console.log(props.options);
    }, [props.value, props.options]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setData(newValue);
        if (props.sendData) {
            props.sendData(props.name, newValue);
        }
    };

    console.log(options)

    return (
        <>
            <label className="col-sm-3 col-form-label">{props.title}</label>
            <div className="col-sm-9">
                <select
                    className="form-select"
                    value={data}
                    onChange={e => handleChange(e)}
                >
                    <option value=''>Chọn loại món ăn</option>
                    {options?.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                    ))}
                </select>
            </div>
        </>
    )
}

export default SelectInput;