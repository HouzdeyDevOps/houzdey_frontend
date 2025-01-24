#### **Use Cases for TanStack Query**:
- Ideal for **server state management** (data fetched from Firestore, MongoDB, or APIs).
- Automatically handles:
  - Caching.
  - Refetching on focus/window re-entry.
  - Background updates.
  - Query invalidation.

#### **Use Cases for Redux**:
- Best for **client state management**:
  - Authentication state.
  - UI state (e.g., modals, notifications).
  - Non-API data shared across components.
  - Persistent state that doesn’t come directly from the server.

#### **How to Combine Them**:
1. Use **TanStack Query** for API calls and server-side state. 
2. Use **Redux** for application-wide state that isn't directly tied to server data.
3. Example:
   ```javascript
   import { useQuery } from '@tanstack/react-query';
   import { useSelector, useDispatch } from 'react-redux';

   const fetchProperties = async () => {
     const res = await fetch('/api/properties');
     return res.json();
   };

   const PropertiesComponent = () => {
     const { data, isLoading } = useQuery(['properties'], fetchProperties);

     const user = useSelector((state) => state.auth.user);
     const dispatch = useDispatch();

     if (isLoading) return <p>Loading...</p>;

     return (
       <div>
         <h1>Welcome, {user.name}</h1>
         {data.map((property) => (
           <p key={property.id}>{property.name}</p>
         ))}
       </div>
     );
   };
   ```

---


### Suggested Feature List for Houzdey:
- **Authentication**:
  - Login/Sign-Up.
  - Role-based access (e.g., renters, landlords).
- **Property Listings**:
  - List, search, and filter properties.
  - View property details.
- **User Dashboard**:
  - Manage listings (for landlords).
  - Save favorites (for renters).
- **Messaging System**:
  - In-app chat between landlords and renters.
- **Payments**:
  - Integration for rent payments.

---

Let me know if you’d like help with any specific part of this setup!