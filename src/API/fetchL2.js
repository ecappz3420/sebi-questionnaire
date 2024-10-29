const fetchL2 = async (guideline_id) => {
    const config = {
        appName: "cyber-security",
        reportName: "Guideline_Level_2_Report",
        criteria: `Guidelines == ${guideline_id}`
    }
    try {
        await ZOHO.CREATOR.init();
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        return response.data;
    } catch (error) {
        console.error(error.responseText);
    }
}
export default fetchL2