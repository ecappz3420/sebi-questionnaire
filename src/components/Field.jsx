import React, { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import fetchL2 from '../API/fetchL2';
import { Breadcrumbs, FormHelperText, Typography } from '@mui/material';
import fetchRecords from '../API/fetchRecords';

const Field = ({ guideline, guideline_id, isMandatory, updateRecords, index, subset_id }) => {
    const [records, setRecords] = useState([]);
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [goal, setGoal] = useState("");
    const [csfunction, setCsFunction] = useState("");
    const [objective, setObjective] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const getAllRecords = await fetchL2(guideline_id);
                setRecords(getAllRecords);
            } catch (error) {
            }
        }
        fetch();
    }, [guideline_id]);


    useEffect(() => {
        const fetch = async () => {
            try {
                const standard_obj = await fetchRecords("Standard_Set_Report", `ID == ${subset_id.ID}`);
                const standard_id = standard_obj[0].Standard[0].ID;
                try {
                    const standardObj = await fetchRecords("Standard_Report", `ID == ${standard_id}`);
                    setObjective(standardObj[0].Objective.display_value);
                    try {
                        const objectiveObj = await fetchRecords("All_Objectives",`ID == ${standardObj[0].Objective.ID}`);
                        try {
                            const csFunctionObj = await fetchRecords("All_Cs_Functions",`ID == ${objectiveObj[0].CS_Function.ID}`);
                            setCsFunction(csFunctionObj[0].Function);
                            setGoal(csFunctionObj[0].CR_Goal.display_value)
                        } catch (error) {
                            console.log(error);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
            }

        }
        fetch();
    }, [subset_id]);

    const handleChange = (e) => {
        setValue(e.target.value);
        setError(false);
        const formData = {
            "data": {
                Guideline_ID: guideline_id,
                Response: e.target.value,
                Questionnaire_Form: 0

            }
        }
        updateRecords(index, formData);
    }
    return (
        <div className={`mb-[20px] border ${isMandatory ? 'border-red-600' : ''} rounded-lg shadow-md p-2`}>
            <FormControl component='field-set' error={error} required>
                <div className="mb-3">
                    <Breadcrumbs>
                        <Typography color='blue'>{goal}</Typography>
                        <Typography color='blue'>{csfunction}</Typography>
                        <Typography color='blue'>{objective}</Typography>
                    </Breadcrumbs>
                </div>

                <div className='mb-[30px] font-semibold text-sm flex'>{guideline} <span className={`text-red-600 ${isMandatory ? 'block' : 'hidden'}`}>*</span></div>
                {
                    records && (
                        <ol type='A' className='list ml-6 mb-5'>
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
                        <FormControlLabel value="Not Complied" control={<Radio size='small' />} label="Not Complied" />
                        <FormControlLabel value="Partially Complied" control={<Radio size='small' />} label="Pratially Complied" />
                        <FormControlLabel value="Do not Know" control={<Radio size='small' />} label="Do not Know" />
                    </RadioGroup>
                    {error && <FormHelperText>Please select an option.</FormHelperText>}
                </div>

            </FormControl>
        </div>
    )
}

export default Field