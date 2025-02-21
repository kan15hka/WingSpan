import React, { useEffect, useState } from "react";
import PageMsgDisplay from "../../components/PageMsgDisplay";
import { useToast } from "../../components/Toast/ToastService";
import { modalType, toastType } from "../../helper/helper";
import CrewTable from "./UsersTable";
import { getUsers } from "../../apis/passengerApi";
import UsersTable from "./UsersTable";
import { axiosInstance } from "../../apis/axiosInstance";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
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

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError(
        "Oops! We couldn't load the users data. Please try again in a bit."
      );
    } finally {
      setLoading(false);
    }
  }

  const onDeleteUser = async (userId) => {
    try {
      const data = await axiosInstance.delete(`/delete_user/${userId}`);
      fetchUsers();
      toast.open(
        data.message || "User deleted successfully.",
        toastType.SUCCESS
      );
    } catch (error) {
      toast.open(
        error?.response?.data?.message || "Error deleting User.",
        toastType.ERROR
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <PageMsgDisplay text="Loading..." />;
  if (error) return <PageMsgDisplay text={error} />;
  return (
    <div className="w-full h-full  flex flex-col">
      <div className="mb-5 text-2xl font-semibold">Users</div>
      <UsersTable
        data={users}
        setModalData={setModalData}
        onTableDeletePressed={onDeleteUser}
      />
    </div>
  );
}
