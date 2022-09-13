import { apiUrl } from "../../config/constants";

export const isNUll = (myVar) => {
  if (typeof myVar === 'undefined' || myVar === null || myVar === 'undefined')
    return true;
  return false;
};

export const UrlWrapper = (fileName) => {
  return `${apiUrl}/${fileName}`
}
