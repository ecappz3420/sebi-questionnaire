const fetchRecords = async (reportName, criteria) => {
    const config = {
        appName: "cyber-security",
        reportName: reportName,
        criteria: criteria
    }
    const response = await ZOHO.CREATOR.API.getAllRecords(config);
    return response.data;
}

export default fetchRecords