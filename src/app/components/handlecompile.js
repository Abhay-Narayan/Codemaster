import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Base64 } from "js-base64";

export const handlecompile = async (
  setProcessing,
  code,
  customInput,
  setOutputDetails,
  language
) => {
  setProcessing(true);

  const formData = {
    language_id: language.id,
    source_code: Base64.encode(code),
    stdin: Base64.encode(customInput),
  };

  const options = {
    method: "POST",
    url: process.env.NEXT_PUBLIC_RAPID_API_URL,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
    },
    data: formData,
  };

  try {
    const response = await axios.request(options);
    console.log("res.data", response.data);
    const token = response.data.token;
    checkStatus(token, setOutputDetails, setProcessing);
  } catch (err) {
    setProcessing(false);
    console.log("catch block...", err);
    showErrorToast();
  }
};

const checkStatus = async (token, setOutputDetails, setProcessing) => {
  const options = {
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_RAPID_API_URL}/${token}`,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    const statusId = response.data.status?.id;

    if (statusId === 1 || statusId === 2) {
      // still processing
      setTimeout(() => {
        checkStatus(token, setOutputDetails, setProcessing);
      }, 2000);
      return;
    } else {
      setProcessing(false);
      setOutputDetails(response.data);
      showSuccessToast(`Compiled Successfully!`);
      console.log("response.data", response.data);
      return;
    }
  } catch (err) {
    console.log("err", err);
    setProcessing(false);
    showErrorToast();
  }
};

const showSuccessToast = (msg) => {
  toast.success(msg || `Compiled Successfully!`, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const showErrorToast = (msg, timer) => {
  toast.error(msg || `Something went wrong! Please try again.`, {
    position: "top-right",
    autoClose: timer || 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
