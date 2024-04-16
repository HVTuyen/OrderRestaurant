import axiosClient from "./axiosClient";

const END_POINT = {
    category: "Category",
}

export const getCategoriesAPI = () => {
    return axiosClient.get(`${END_POINT.category}`);
}

export const getCategoryAPI = (id) => {
    return axiosClient.get(`${END_POINT.category}/${id}`);
}

export const deleteCategoryAPI = (id) => {
    return axiosClient.delete(`${END_POINT.category}/${id}`);
}