import React, { useEffect, useState } from 'react'
import Field from './components/Field'
import fetch from './API/fetch';
import { Button } from '@mui/material';
import addRecord from './API/addRecord'

const App = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitRecords, setSubmitRecords] = useState([]);

  const updateRecords = (index, value) => {
    setSubmitRecords(prevState => {
      const updatedData = [...prevState]
      updatedData[index] = value
      return updatedData;
    })
  }

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const getRecords = await fetch();
        setRecords(getRecords);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }

    }
    fetchRecords();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ZOHO.CREATOR.init();
    const queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
    const formData = {
      "data": {
        "Customer": queryParams.customer
      }
    }
    console.log(formData);
    const mainRecord = await addRecord("Questionnaire_Form", formData);
    const allRecords = submitRecords.map(item => ({
      data: {
        ...item.data,
        Questionnaire_Form: mainRecord.ID
      }
    }
    ))
    
    allRecords.map(async data =>{
      await addRecord("Questionnaire_Line_Items", data);
      location.reload();
    } );

  }

  return (
    <div className='poppins p-2'>
      <div className='text-center rounded font-bold text-lg text-white bg-blue-600 p-2 mb-3'>Questionnaire</div>
      {
        loading === true ? (
          <div className='text-center'>Loading...</div>
        )
          :
          (
            <form onSubmit={handleSubmit}>
              <ol className='list-number'>
                {
                  records.map((record, index) => (
                    <li key={index}>
                      <Field
                        guideline={record.Guideline_Description}
                        guideline_id={record.ID}
                        isMandatory={record.isMandatory}
                        updateRecords={updateRecords}
                        index={index}
                        subset_id={record.Standard_Set} />
                    </li>

                  ))
                }
              </ol>
              <div className='text-center'>
                <Button type='submit' variant='contained'>Submit</Button>
              </div>
            </form>
          )
      }

    </div>
  )
}

export default App