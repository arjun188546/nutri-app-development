import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../redux/auth/authSlice";
import { useAuthenticateQuery } from "../redux/authenticate/authenticateApiSlice";

const RequireAuth = ({ children, allowedRole }) => {
  return children;
};

export default RequireAuth;
