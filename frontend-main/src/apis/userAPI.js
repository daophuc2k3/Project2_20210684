import instance from "./axiosConfig";
import FetchBase from "./FetchBase";

class UserAPI extends FetchBase {
  patchForm = async (id, data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await instance.patch(`/user/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };
}

const userAPI = new UserAPI("/user");

export default userAPI;
