import axios from "axios";

export const LOGINREQUEST = async (url, data, antiForgeryToken) => {
  return await axios
    .post(url, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error.response;
    });
};

export const GETWAITINGLIST = async (url, antiForgeryToken) => {
  return await axios
    .get(url, {})
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log("Error" + error.response);
    });
};

export const UPDATEWAITINGLIST = async (url, data, antiForgeryToken) => {
  return await axios
    .put(url, data)
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error.response;
    });
};