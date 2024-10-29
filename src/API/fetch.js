const fetchStandardSet =async () => {
    const queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
    const config = {
        appName: "cyber-security",
        reportName: "Standard_Set_Report",
        criteria: `RE == ${queryParams.RE_ID}`
    }
    try {
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        let allrecords = response.data;
        allrecords.forEach(record => { 
            const isMandatory = record.Mandatory_RE_s ? record.Mandatory_RE_s.map(rec => rec.ID).includes(queryParams.RE_ID) : false;
            record["isMandatory"] = isMandatory;
        } )
        return allrecords;
    } catch (error) {
        console.log(error);
    }
}

const fetch = async () => {
    try {
        await ZOHO.CREATOR.init();
        const standardSetRecords = await fetchStandardSet();
        let records = [];

        for (let i = 0; i < standardSetRecords.length; i++) {
            const config = {
                appName: "cyber-security",
                reportName: "All_Guidelines",
                criteria: `Standard_Set == ${standardSetRecords[i].ID}`
            };

            try {
                const response = await ZOHO.CREATOR.API.getAllRecords(config);
                records = [
                    ...records,
                    ...response.data.map(record => ({
                        ...record,
                        isMandatory: standardSetRecords[i].isMandatory === true
                    }))
                ];
            } catch (error) {
                console.log("Error fetching records for standard set ID:", standardSetRecords[i].ID, error);
            }
        }
        return records;

    } catch (error) {
        console.log("Error initializing or fetching standard set:", error);
    }
};


export default fetch