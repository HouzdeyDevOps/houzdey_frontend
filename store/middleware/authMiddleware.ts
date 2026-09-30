import { createListenerMiddleware } from '@reduxjs/toolkit';
import { logout } from '../slices/userAuthSlice';
import { setWishlistItems } from '../slices/wishlistSlice';

export const authMiddleware = createListenerMiddleware();

// The httpOnly access_token/refresh_token cookies are cleared server-side by authApi.logout()
// (POST /users/logout); client JS cannot read or clear an httpOnly cookie. This listener only
// clears derived client state.
authMiddleware.startListening({
  actionCreator: logout,
  effect: (action, { dispatch }) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('wishlist');
    dispatch(setWishlistItems([]));
  }
});
