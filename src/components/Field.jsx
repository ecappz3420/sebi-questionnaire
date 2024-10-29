import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import fetchL2 from '../API/fetchL2';
import { FormHelperText } from '@mui/material';

const Field = ({ guideline, guideline_id ,isMandatory,updateRecords, index}) => {
    const [records, setRecords] = useState([]);
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            try {
                const getAllRecords = await fetchL2(guideline_id);
                setRecords(getAllRecords);
            } catch (error) {
                console.log(error);
            }

        }
        fetch();
    }, [guideline_id]);

    const handleChange = (e)=>{
        setValue(e.target.value);
        setError(false);
        const formData = {
            "data": {
                Guideline_ID: guideline_id,
                Response : e.target.value,
                Questionnaire_Form: 0

            }
        }
        updateRecords(index, formData);
    }
    return (
        <div className={`mb-[20px] border ${isMandatory ? 'border-red-600' : ''} rounded-lg shadow-md p-2`}>
            <FormControl component='field-set' error={error} required>
                <div className='mb-3 font-semibold flex'>{guideline} <span className={`text-red-600 ${isMandatory ? 'block' : 'hidden'}`}>*</span></div>
                {
                    records && (
                        <ol type='A' className='list ml-6'>
                            {
                                records.map((record, index) => (
                                    <li className='text-sm' key={index}>{record.Guideline_Description}</li>
                                ))
                            }
                        </ol>
                    )
                }
                <div className="ml-4">
                    <RadioGroup
                    row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                        
                    >
                        <FormControlLabel className='px-2 rounded' style={{ fontSize: "15px" }} value="Complied" control={<Radio size='small' />} label="Complied" />
                        <FormControlLabel value="Not Compiled" control={<Radio size='small' />} label="Not Compiled" />
                        <FormControlLabel value="Partially Compiled" control={<Radio size='small' />} label="Pratially Compiled" />
                        <FormControlLabel value="Do not Know" control={<Radio size='small' />} label="Do not Know" />
                    </RadioGroup>
                    {error && <FormHelperText>Please select an option.</FormHelperText>}
                </div>

            </FormControl>
        </div>
    )
}

export default Field