// app/auth/page.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
// import { login, logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { login, logout } from "@/store/slices/userAuthSlice";

export default function AuthPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.userAuth);

  return (
    <div>
      {auth.isAuthenticated ? (
        <>
          {/* <p>Welcome, {auth.user?.name}</p> */}
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <button onClick={() => dispatch(login({ name: "John Doe" }))}>
          Login
        </button>
      )}
    </div>
  );
}
