require('dotenv').config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    isEmail: (value) => {
        let regEx =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regEx.test(String(value).toLowerCase());
      },
 hashData: async (data) => {
    try {
      const hashedPassword = await bcrypt.hash(data, 10);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  },
  comparehashedData: async (HashedData, data) => {
    try {
      return await bcrypt.compare(HashedData, data);
    } catch (error) {
      console.log(error);
    }
  },
  jwtsign: async (payload) => {
    try {
      const token = jwt.sign({ id: payload }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRY
      });
      return 'Bearer ' + token;
    } catch (error) {
      console.log(error);
    }
  },
  jwtverify : async (payload) => {
    try {
        const token = payload.split(' ')[1]
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; 
    } catch (error) {
        console.log(error);
        throw error;
    }
},
}
