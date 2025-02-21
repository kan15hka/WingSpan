import React, { useEffect, useState } from "react";
import PageMsgDisplay from "../../components/PageMsgDisplay";
import { useToast } from "../../components/Toast/ToastService";
import { addCrew, deleteCrew, editCrew, getCrew } from "../../apis/crewApi";
import { modalType, toastType } from "../../helper/helper";
import CrewModal from "./CrewModal";
import CrewTable from "./CrewTable";
export default function CrewsPage() {
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal Logic
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

  async function fetchCrew() {
    try {
      setLoading(true);
      const data = await getCrew();
      setCrews(data);
    } catch (error) {
      setError(
        "Oops! We couldn't load the crew data. Please try again in a bit."
      );
    } finally {
      setLoading(false);
    }
  }

  const onAddCrew = async (crewData) => {
    try {
      const data = await addCrew(crewData);
      closeModel(); // Close modal on success
      fetchCrew();
      toast.open(data.message || "Crew added successfully.", toastType.SUCCESS);
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error adding crew.",
        toastType.ERROR
      );
    }
  };

  const onEditCrew = async (crewData, crewId) => {
    try {
      const data = await editCrew(crewData, crewId);
      closeModel(); // Close modal on success
      fetchCrew();
      toast.open(
        data.message || "Crew edited successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      toast.open(
        error?.response?.data?.message || "Error edited crew.",
        toastType.ERROR
      );
    }
  };

  const onDeleteCrew = async (crewId) => {
    try {
      const data = await deleteCrew(crewId);
      fetchCrew();
      toast.open(
        data.message || "Crew deleted successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      toast.open(
        error?.response?.data?.message || "Error deleting crew.",
        toastType.ERROR
      );
    }
  };

  useEffect(() => {
    fetchCrew();
  }, []);

  if (loading) return <PageMsgDisplay text="Loading..." />;
  if (error) return <PageMsgDisplay text={error} />;
  return (
    <div className="w-full h-full  flex flex-col">
      <div className="mb-5 text-2xl font-semibold">Crews</div>
      <CrewTable
        data={crews}
        setModalData={setModalData}
        onTableDeletePressed={onDeleteCrew}
      />
      <CrewModal
        modalData={modalData}
        onAddCrew={onAddCrew}
        onEditCrew={onEditCrew}
        onClose={closeModel}
      />
    </div>
  );
}
