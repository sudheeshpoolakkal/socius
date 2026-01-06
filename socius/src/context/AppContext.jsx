import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [items, setItems] = useState([]); // Replaces doctors
  const [hospitals, setHospitals] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const [requests, setRequests] = useState([]); // Replaces appointments
  const [incomingRequests, setIncomingRequests] = useState([]); // Requests for user's items

  const getItemsData = async () => { // Replaces getDoctorsData
    try {
      const { data } = await axios.get(backendUrl + "/api/item/list");
      if (data.success) {
        setItems(data.items);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getHospitalsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/list");
      if (data.success) {
        setHospitals(data.hospitals);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const loadRequests = async () => { // Replaces loadAppointments
    try {
      const { data } = await axios.get(backendUrl + "/api/user/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setRequests(data.requests.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getIncomingRequestsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/incoming-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setIncomingRequests(data.requests.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/update-request-status', { requestId, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        getIncomingRequestsData(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const renewUserRequest = async (requestId, duration) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/renew-request', { requestId, duration }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        loadRequests(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  };

  const tipAndRateUser = async (requestId, tipAmount, rating) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/tip-rate-owner', { requestId, tipAmount, rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        loadRequests(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  };

  const completePurchase = async (requestId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/complete-purchase', { requestId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        loadRequests(); // Refresh list to show completed
        loadUserProfileData(); // Refresh wallet balance
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  };

  // Helper to find specific item
  const getItemById = (itemId) => {
    return items.find(item => item._id === itemId);
  }

  useEffect(() => {
    getItemsData(); // Fetch items on load
    getHospitalsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
      loadRequests();
      getIncomingRequestsData();
    } else {
      setUserData(false);
      setIncomingRequests([]);
      setRequests([]);
    }
  }, [token]);

  // Logout function clears token and userData then navigates to login.
  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    setUserData(false);
    navigate("/login");
  };

  const value = {
    items, // Exposed items
    getItemsData,
    hospitals,
    getHospitalsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    requests, // Exposed requests
    loadRequests,
    incomingRequests,
    getIncomingRequestsData,
    updateRequestStatus,
    renewUserRequest,
    tipAndRateUser,
    completePurchase,
    logout,
    getItemById,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;