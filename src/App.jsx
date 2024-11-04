import React, { useEffect, useState } from 'react';
import Field from './components/Field';
import fetch from './API/fetch';
import { Button } from '@mui/material';
import addRecord from './API/addRecord';
import UpdateField from './components/updateField';
import fetchRecords from './API/fetchRecords';

const App = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitRecords, setSubmitRecords] = useState([]);
  const [fromType, setFormType] = useState("Add");
  const [updatedRecord, setUpdatedRecord] = useState({});

  const updateRecords = (index, value) => {
    setSubmitRecords(prevState => {
      const updatedData = [...prevState];
      updatedData[index] = value || {};
      return updatedData;
    });
  };

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);

        const getRecords = await fetch();
        setRecords(getRecords);

        const queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
        const getUpdatedRecords = await fetchRecords("All_Questionnaires", `Customer == ${queryParams.customer}`);

        if (getUpdatedRecords.length > 0) {
          setUpdatedRecord(getUpdatedRecords[0]);
          setFormType("Update");
        } else {
          setFormType("Add");
        }
      } catch (error) {
        console.log("Error loading records:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await ZOHO.CREATOR.init();
        const queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();

        if (fromType === "Add") {
            const formData = {
                "data": {
                    "Customer": queryParams.customer
                }
            };
            const mainRecord = await addRecord("Questionnaire_Form", formData);
            const allRecords = submitRecords.map(item => ({
                data: {
                    ...item.data,
                    Questionnaire_Form: mainRecord.ID
                }
            }));

            await Promise.all(allRecords.map(async data => {
                await addRecord("Questionnaire_Line_Items", data);
            }));
            window.location.reload();

        } else if (fromType === "Update") {
            const updatePromises = submitRecords.map(async data => {
                try {
                    const fetchData = await fetchRecords("All_Questionnaire_Line_Items", `Questionnaire_Form == ${data.data.Questionnaire_Form} && Guideline_ID == ${data.data.Guideline_ID}`);
                    const config = {
                        appName: "cyber-security",
                        reportName: "All_Questionnaire_Line_Items",
                        id: fetchData[0].ID,
                        data: data
                    };
                    const response = await ZOHO.CREATOR.API.updateRecord(config);
                } catch (error) {
                    const config = {
                        appName: "cyber-security",
                        formName: "Questionnaire_Line_Items",
                        data: data
                    };
                    await ZOHO.CREATOR.API.addRecord(config);
                }
                window.location.reload();
            });

            await Promise.all(updatePromises);
        }

        
    } catch (error) {
        console.log("Error during submission:", error);
    }
};


  return (
    <div className='poppins p-2'>
      <div className='text-center rounded font-bold text-lg text-white bg-blue-600 p-2 mb-3'>CSCRF Assessment</div>
      {loading ? (
        <div className='text-center'>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <ol className='list-number'>
            {records.map((record, index) => (
              <li key={index}>
                {fromType === "Add" ? (
                  <Field
                    guideline={record.Guideline_Description}
                    guideline_id={record.ID}
                    isMandatory={record.isMandatory}
                    updateRecords={updateRecords}
                    index={index}
                    subset_id={record.Standard_Set}
                  />
                ) : fromType === "Update" ? (
                  <UpdateField
                    guideline={record.Guideline_Description}
                    guideline_id={record.ID}
                    isMandatory={record.isMandatory}
                    updateRecords={updateRecords}
                    index={index}
                    subset_id={record.Standard_Set}
                    updatedRecord={updatedRecord}
                  />
                ) : null}
              </li>
            ))}
          </ol>
          <div className='text-center'>
            <Button type='submit' variant='contained'>Submit</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default App;
