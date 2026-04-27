
import API from "./api";

export const createProperty = (data) =>
  API.post("/properties", data);

export const getProperties = () =>
  API.get("/properties");

export const deleteProperty = (id) =>
  API.delete(`/properties/${id}`);