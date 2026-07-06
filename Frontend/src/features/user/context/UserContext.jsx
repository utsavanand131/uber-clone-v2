import React, { createContext, useEffect, useState } from "react";
import socket from "../../../socket/socket";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    _id: "",
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
  });

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", {
      userId: user._id,
      userType: "user",
    });
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
