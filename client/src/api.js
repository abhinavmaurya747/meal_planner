import axios from "axios";

const api = axios.create({
  // baseURL: "https://meal-planner-sokv.onrender.com", // Replace with your backend server URL
  baseURL: "http://localhost:5000",
});

export const postData = async (url, data) => {
  try {
    const response = await api.post(url, data);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

export const fetchData = async (url) => {
  try {
    const response = await fetch("download_pdf_file");
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
export default {
  postData: postData,
  fetchData: fetchData,
};
