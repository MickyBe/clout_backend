import { apiKey } from "../../config/constants";

const ApiKeyAuthorization = async (req, res, next) => {
    const header = req?.headers;
    if (header) {
      if (header.authorization) {
        const auth = header.authorization;
        if (auth == apiKey) {
            req.uid = auth;
            next();
            return;
        }
      }
    }
    res.status(403).send({ error: 'User not authorized' });
    return;
  };
  
  export default ApiKeyAuthorization;