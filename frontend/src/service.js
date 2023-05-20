import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const createItem = async (newItem) => {
  const res = await axios.post(baseUrl, newItem);
  return res.data;
};

const deleteItem = async (id) => {
  axios.delete(`${baseUrl}/${id}`);
};

const updateItem = async (newItem) => {
  const res = await axios.put(`${baseUrl}/${newItem.id}`, newItem);
  return res.data;
};

const networkService = {
  getAll: getAll,
  createItem: createItem,
  deleteItem: deleteItem,
  updateItem: updateItem,
};

export default networkService;
