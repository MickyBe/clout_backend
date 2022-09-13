import firebase from '../../config/firebaseConfig';

const AuthorizationMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  try {
    if (!header) {
      return res.status(403).json({ error: 'User not authorized' });
    } else {
      const tkArr = header.split(' ');
      if (tkArr.length > 1) {
        const token = tkArr[1];
        const tokenUser = await firebase.auth().verifyIdToken(token);
        req.uid = tokenUser.uid;
        next();
      }
      return res.status(403).json({ error: 'User not authorized' });
    }
  } catch (err) {
    return res.status(403).json({ error: 'User not authorized' });
  }
};

export default AuthorizationMiddleware;
