import API from "./api";

export const generateDescription = (data) =>
  API.post("/ai/generate-description", data);
