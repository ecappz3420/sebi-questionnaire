const fetchStandardSet = async () => {
    const queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
    const config = {
        appName: "cyber-security",
        reportName: "Standard_Set_Report",
        criteria: `RE == ${queryParams.RE_ID}`
    };

    try {
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        const allRecords = response.data;

        allRecords.forEach(record => {
            const isMandatory = record.Mandatory_RE_s ?
                record.Mandatory_RE_s.map(rec => rec.ID).includes(queryParams.RE_ID) : false;
            record.isMandatory = isMandatory;
        });

        return allRecords;
    } catch (error) {
        console.error("Error fetching standard set records:", error);
        return [];
    }
};

const fetch = async () => {
    try {
        await ZOHO.CREATOR.init();
        const standardSetRecords = await fetchStandardSet();

        // Use Promise.all with map to fetch records concurrently
        const records = await Promise.all(standardSetRecords.map(async (standardSetRecord) => {
            const config = {
                appName: "cyber-security",
                reportName: "All_Guidelines",
                criteria: `Standard_Set == ${standardSetRecord.ID}`
            };

            try {
                const response = await ZOHO.CREATOR.API.getAllRecords(config);
                return response.data.map(record => ({
                    ...record,
                    isMandatory: standardSetRecord.isMandatory === true
                }));
            } catch (error) {
                // console.error("Error fetching records for standard set ID:", standardSetRecord.ID, error);
                return [];
            }
        }));

        
        return records.flat(); 
    } catch (error) {
        // console.error("Error initializing or fetching standard set:", error);
        return [];
    }
};

export default fetch;
