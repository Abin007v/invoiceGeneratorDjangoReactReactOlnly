import { BrowserRouter, Route, Routes } from "react-router-dom";
import InvoiceForm from "./components/InvoiceForm";
import LoginPage from "./components/LoginPage";
import UserPannel from "./components/UserPannel";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/invoice" element={<InvoiceForm />} />
            <Route path="/user" element={<UserPannel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
