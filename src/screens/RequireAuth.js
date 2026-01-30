import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../redux/auth/authSlice";
import { useAuthenticateQuery } from "../redux/authenticate/authenticateApiSlice";

const RequireAuth = ({ children, allowedRole }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.token);
  const user = useSelector((state) => state.auth.user);

  const { data, isLoading, isSuccess, isError, error } = useAuthenticateQuery();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      if (isError && error?.status === 403) {
        setAuthChecked(true);
      }

      if (isSuccess) {
        dispatch(setCredentials({ accessToken: token, user: data?.data }));
        setAuthChecked(true);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isError, isSuccess, error, dispatch, token, data]);

  if (isLoading || !authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Checking authentication...</Text>
      </View>
    );
  }

  if (!user) {
    // If auth checked and no user, the Navigator should handle the transition or we can handle it here if navigation is available.
    // However, since this is used inside a Stack, if user is null and we are here, something is wrong or redirect is needed.
  }

  if (allowedRole && !allowedRole.includes(user?.role)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Unauthorized Access</Text>
      </View>
    );
  }

  return children;
};

export default RequireAuth;
