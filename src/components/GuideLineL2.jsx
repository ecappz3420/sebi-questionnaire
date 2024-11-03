import React, { useEffect, useState } from 'react'
import fetchL3 from '../API/fetchL3'

const GuideLineL2 = ({ guideline_l2 }) => {
    const [records, setReccords] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            try {
                const getRecords = await fetchL3(guideline_l2.ID);
                setReccords(getRecords);
            } catch (error) {
                console.log(error);
            }

        }
        fetch();
    }, [guideline_l2])
    return (
        <div className='mt-3'>
            <ol className='list-roman'>
                {
                    records && records.map((record, index) => (
                        <li key={index}>{record.Guideline_Description}</li>
                    ))
                }
            </ol>
        </div>
    )
}

export default GuideLineL2