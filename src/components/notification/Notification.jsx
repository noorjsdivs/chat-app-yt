import React from "react";
import { Toaster } from "react-hot-toast";

const Notification = () => {
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            border: "1px solid blue",
            padding: "16px",
            color: "#fff",
            background: "#000",
          },
        }}
      />
    </div>
  );
};

export default Notification;
