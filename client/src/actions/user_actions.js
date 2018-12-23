import axios from "axios";
import { USER_SERVER } from "../components/utils/misc";
import { LOGIN_USER } from "./types";

export async function loginUser(dataToSubmit) {
  const request = await axios.post(`${USER_SERVER}/login`, dataToSubmit);
  const response = await request.data;

  return {
    type: LOGIN_USER,
    payload: response
  };
}
