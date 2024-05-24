import React from "react";
import "./login.css";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      toast.success("Account created! You can login now!");
      setShowRegister(false);
    } catch (error) {
      console.log("Error", error);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const { email, password } = Object.fromEntries(formData);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Email or Password not matched";
          break;
        // Add more cases as needed
        default:
          errorMessage = "An error occurred. Please try again.";
      }
      console.log("Error", error?.code);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      {!showRegister && (
        <div className="item">
          <h2>Welcome back,</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={loading}>
              {loading ? "Loading" : "Sign In"}
            </button>
          </form>
          <p>
            Doesn't have an Account?{" "}
            <span onClick={() => setShowRegister(true)}>Register</span>
          </p>
        </div>
      )}
      {/* <div className="separator"></div> */}
      {showRegister && (
        <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handleRegister}>
            <label htmlFor="file">
              <img src={avatar?.url || "./avatar.png"} alt="user" /> Upload an
              image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input type="text" placeholder="Username" name="username" />
            <input type="text" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button disabled={loading}>
              {loading ? "Loading" : "Sign Up"}
            </button>
          </form>
          <p>
            Already have an Account?{" "}
            <span onClick={() => setShowRegister(false)}>Login</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
