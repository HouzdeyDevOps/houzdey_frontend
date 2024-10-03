# Houzdey Frontend

## 🏠 About Houzdey

Houzdey is a cutting-edge rental property platform designed to revolutionize the way tenants find their ideal homes and landlords manage their properties. Our mission is to create a seamless, user-friendly experience for all parties involved in the rental process.

## 🚀 Features

- **Property Search**: Advanced filters to find the perfect property
- **Real-time Chat**: Instant communication between tenants and landlords
- **Interactive Maps**: Visualize property locations with Google Maps integration
- **User Profiles**: Manage your account, listings, and preferences
- **Secure Payments**: Integrated Paystack for safe transactions
- **Responsive Design**: Seamless experience across desktop and mobile devices

## 🛠 Tech Stack

- **React.js**: For building a dynamic and responsive user interface
- **Tailwind CSS**: For rapid and customizable styling
- **Zustand/React Query**: For efficient state management
- **Stream Chat API**: For real-time messaging functionality
- **Auth0**: For secure authentication and authorization

## 🏗 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/houzdey/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   REACT_APP_API_URL=<backend_api_url>
   REACT_APP_STREAM_API_KEY=<stream_chat_api_key>
   REACT_APP_GOOGLE_MAPS_API_KEY=<google_maps_api_key>
   REACT_APP_AUTH0_DOMAIN=<auth0_domain>
   REACT_APP_AUTH0_CLIENT_ID=<auth0_client_id>
   ```

4. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

5. Open `http://localhost:3000` in your browser to view the app.

## 🧪 Testing

Run the test suite with:

```
npm test
```
or
```
yarn test
```

## 🚢 Deployment

1. Build the production-ready app:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

2. Deploy the contents of the `build` folder to your hosting provider of choice (e.g., Netlify, Vercel, or AWS S3).

## 🤝 Contributing

We welcome contributions to Houzdey! Please check out our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions, please file an issue on our [GitHub issue tracker](https://github.com/houzdey/frontend/issues) or contact our support team at support@houzdey.com.

---

Built with ❤️ by the Houzdey Team