import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ItemDetails from "./pages/ItemDetails";
import Author from "./pages/Author";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

function App() {
useEffect(() => {
AOS.init({
duration: 1000,
once: true,
offset: 120,
});
}, []);

return (
<Router>
<Nav />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/explore" element={<Explore />} />
<Route path="/author/:authorId" element={<Author />} />
<Route path="/author" element={<Author />} />
<Route path="/item-details/:itemId" element={<ItemDetails />} />
</Routes>
<Footer />
</Router>
);
}

export default App;
