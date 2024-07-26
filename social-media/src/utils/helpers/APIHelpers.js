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

export const GETWAITINGBYCSRLIST = async (
  url,
  antiForgeryToken,
  bearerToken
) => {
  const headers = {
    Authorization: `Bearer ${bearerToken}`,
  };

  return await axios
    .get(url, { headers })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log("Error" + error.response);
    });
};

export const UPDATEWAITINGLIST = async (
  url,
  data,
  bearerToken
) => {
  const headers = {
    Authorization: `Bearer ${bearerToken}`,
  };
  return await axios
    .put(url, data, { headers })
    .then((res) => {
      return res;
    })
    .catch(function (error) {
      return error.response;
    });
};
