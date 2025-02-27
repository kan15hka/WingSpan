import React, { useEffect, useState } from "react";
import PageMsgDisplay from "../../components/PageMsgDisplay";
import { useToast } from "../../components/Toast/ToastService";
import { modalType, toastType } from "../../helper/helper";
import AuthorityModal from "./AuthorityModal";
import {
  addAuthority,
  deleteAuthority,
  getAuthorities,
} from "../../apis/authorityAuthApi";
import AuthorityTable from "./AuthorityTable";

export default function AuthorityPage() {
  const [authorities, setAuthorities] = useState([]);
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

  async function fetchAuthority() {
    try {
      setLoading(true);
      const data = await getAuthorities();
      setAuthorities(data);
    } catch (error) {
      setError(
        "Oops! We couldn't load the authority data. Please try again in a bit."
      );
    } finally {
      setLoading(false);
    }
  }

  const onAddAuthority = async (authorityData) => {
    try {
      const responseData = await addAuthority(authorityData);

      toast.open(
        responseData.message || "Authority added successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      console.log(error);
      toast.open(
        error?.response?.data?.message || "Error adding authority.",
        toastType.ERROR
      );
    } finally {
      closeModel();
      fetchAuthority();
    }
  };

  const onDeleteAuthority = async (authorityId) => {
    try {
      const data = await deleteAuthority(authorityId);
      fetchAuthority();
      toast.open(
        data.message || "Authority deleted successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      toast.open(
        error?.response?.data?.message || "Error deleting authority.",
        toastType.ERROR
      );
    }
  };

  useEffect(() => {
    fetchAuthority();
  }, []);

  if (loading) return <PageMsgDisplay text="Loading..." />;
  if (error) return <PageMsgDisplay text={error} />;
  return (
    <div className="w-full h-full  flex flex-col">
      <div className="mb-5 text-2xl font-semibold">Authority</div>
      <AuthorityTable
        data={authorities}
        setModalData={setModalData}
        onTableDeletePressed={onDeleteAuthority}
      />
      <AuthorityModal
        modalData={modalData}
        onAddAuthority={onAddAuthority}
        onClose={closeModel}
      />
    </div>
  );
}
