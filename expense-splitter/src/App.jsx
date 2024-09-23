import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Expense from "./components/expense/Expense";
import Group from "./components/group/Group";
import Footer from "./components/layout/Footer";
import { DataProvider } from "./components/context/SiteContext";
import Header from "./components/layout/Header";
import Modal from "./components/ui/Modal";
import ReceiptUpload from "./components/upload/ReceiptUpload";
import Friend from "./components/friend/Friend";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <DataProvider>
        <div className="flex h-[100vh] flex-col">
          <Header />
          <div className="flex h-full flex-col overflow-y-auto">
            <Modal />
            <section className="mx-auto w-full max-w-4xl px-4 py-6 font-semibold">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/groups" element={<Group />} />
                <Route path="/friends" element={<Friend />} />
                <Route path="/expenses" element={<Expense />} />
                <Route path="/receipts" element={<ReceiptUpload />} />
              </Routes>
            </section>
            <Footer />
          </div>
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;
