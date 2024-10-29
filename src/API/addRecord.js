const addRecord = async (formName, formData)=> {
const config = {
    appName: "cyber-security",
    formName: formName,
    data: formData
}
try {
    await ZOHO.CREATOR.init();
    const response = await ZOHO.CREATOR.API.addRecord(config);
    return response.data;
} catch (error) {
    console.log(error);
}
}

export default addRecord