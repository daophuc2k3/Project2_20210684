import instance from "./axiosConfig";
import FetchBase from "./FetchBase";

class FootballAPI extends FetchBase {
  postForm = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        [...data[key]].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await instance.post("/football", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };

  patchForm = async (id, data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        [...data[key]].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await instance.patch(`/football/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };
}

const footballAPI = new FootballAPI("/football");

export default footballAPI;
