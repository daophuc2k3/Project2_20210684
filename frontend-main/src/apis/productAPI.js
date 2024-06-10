import instance from "./axiosConfig";
import FetchBase from "./FetchBase";

class ProductAPI extends FetchBase {
  postForm = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await instance.post("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };

  patchForm = async (id, data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await instance.patch(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  };
}

const productAPI = new ProductAPI("/product");

export default productAPI;
