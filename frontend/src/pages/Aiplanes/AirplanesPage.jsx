import React, { useEffect, useState } from "react";
import {
  addAirplanes,
  deleteAirplane,
  editAirplanes,
  getAirplanes,
} from "../../apis/airplaneApi.js";

import AirplaneCard from "../../components/AirplaneCard.jsx";
import PageMsgDisplay from "../../components/PageMsgDisplay.jsx";
import AirplaneModal from "./AirplaneModal.jsx";
import { useToast } from "../../components/Toast/ToastService.jsx";
import { toastType, modalType } from "../../helper/helper";

export default function AirplanesPage() {
  const [airplanes, setAirplanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal Logic
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [type, setType] = useState(modalType.ADD);
  const [modalData, setModalData] = useState({
    open: false,
    type: modalType.ADD,
    data: null,
  });

  const closeModel = () => {
    setModalData({
      open: false,
      type: modalType.ADD,
      data: null,
    });
  };

  //Toast Logic
  const toast = useToast();

  async function fetchAirplanes() {
    try {
      setLoading(true);
      const data = await getAirplanes();
      setAirplanes(data);
    } catch (error) {
      setError(
        "Oops! We couldn't load the airplane data. Please try again in a bit."
      );
    } finally {
      setLoading(false);
    }
  }

  const onAddAirplane = async (formData) => {
    try {
      const data = await addAirplanes(formData);
      closeModel(); // Close modal on success
      fetchAirplanes();
      toast.open(
        data.message || "Airplane added successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      toast.open(
        error?.response?.data?.message || "Error adding Airplane.",
        toastType.ERROR
      );
    }
  };

  const onEditAirplane = async (formData, id) => {
    try {
      const data = await editAirplanes(formData, id);
      closeModel(); // Close modal on success
      fetchAirplanes();
      toast.open(
        data.message || "Airplane edited successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      toast.open(
        error?.response?.data?.message || "Error edited Airplane.",
        toastType.ERROR
      );
    }
  };

  const onDeleteAirplane = async (airplane) => {
    try {
      const data = await deleteAirplane(airplane.id);
      fetchAirplanes();
      toast.open(
        data.message || "Airplane deleted successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error deleting Airplane.",
        toastType.ERROR
      );
    }
  };

  useEffect(() => {
    fetchAirplanes();
  }, []);

  if (loading) return <PageMsgDisplay text="Loading..." />;
  if (error) return <PageMsgDisplay text={error} />;

  return (
    <div>
      <div className="mb-5 text-2xl font-semibold">Airplanes</div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {airplanes.map((airplane) => (
          <AirplaneCard
            key={airplane.id}
            airplane={airplane}
            setModalData={setModalData}
            onDeleteAirplane={onDeleteAirplane}
          />
        ))}
      </div>

      {/* Add Airplane Button */}
      <button
        onClick={() => {
          setModalData({
            open: true,
            type: modalType.ADD,
            data: null,
          });
        }}
        className="fixed bg-primary shadow-sm shadow-black right-10 bottom-10 h-12 w-12 rounded-full flex items-center justify-center"
      >
        <p className="text-2xl text-white">+</p>
      </button>

      {/* Modal */}
      <AirplaneModal
        onAddAirplane={onAddAirplane}
        onEditAirplane={onEditAirplane}
        modalData={modalData}
        onClose={closeModel}
      />
    </div>
  );
}
