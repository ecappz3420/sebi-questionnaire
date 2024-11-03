const fetchL3 = async (guideline_id) => {
    const config = {
        appName: "cyber-security",
        reportName: "Guideline_Level_3_Report",
        criteria: `Guideline_Level_2 == ${guideline_id}`
    }
    try {
        await ZOHO.CREATOR.init();
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        return response.data;
    } catch (error) {
        console.error(error.responseText);
    }
}
export default fetchL3