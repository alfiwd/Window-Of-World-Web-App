// Import library
import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";

// Import asset
import AddBookIcon from "../assets/icon/add-book-icon.svg";

// Import components
import IconWowOnlyAdmin from "../components/IconWowOnlyAdmin";
import DropdownUserIcon from "../components/dropdown/DropdownUserIcon";
import DropdownStatus from "../components/dropdown/DropdownStatus";

// Import API
import { API } from "../config/api";

export default function ListTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [idTransaction, setIdTransaction] = useState(null);
  const [status, setStatus] = useState(null);

  // Function get transactions
  const getTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTransactions(response.data.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTransactions();
  }, [status]);

  const handleOnCLick = (e) => {
    setStatus(e.target.innerText);
  };
  return (
    <>
      <Container fluid style={{ backgroundColor: "#E5E5E5", paddingTop: "30px", height: "100vh" }}>
        <div className="d-flex justify-content-between">
          <IconWowOnlyAdmin />
          <DropdownUserIcon link={"/add-book"} text={"Add Book"} img={AddBookIcon} />
        </div>
        <div className="mx-auto w-75" style={{ marginTop: "95px" }}>
          <h4 style={{ marginBottom: "42px" }}>Incoming Transaction</h4>
          <Table responsive="sm" striped hover>
            <thead>
              <tr>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>No</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Users</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Account Number</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Transfer Proof</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Remaining Active</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Status User</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Status Payment</span>
                </th>
                <th className="p-4">
                  <span style={{ color: "#D60000" }}>Status</span>
                </th>
              </tr>
            </thead>
            <tbody onClick={handleOnCLick}>
              {transactions.map((data, index) => (
                <tr>
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{data.users.full_name}</td>
                  <td className="p-4">{data.account_number}</td>
                  <td className="p-4">
                    <img src={data.transfer_proof} alt="" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                  </td>
                  <td className="p-4">{data.remaining_active} / Day</td>
                  <td className="p-4">{data.remaining_active > 0 ? <b className="text-success">Active</b> : <b style={{ color: "#FF0742" }}>Not Active</b>}</td>
                  <td className="p-4">
                    {data.payment_status === "Approve" ? <b className="text-success">Approve</b> : ""}
                    {data.payment_status === "Pending" ? <b className="text-warning">Pending</b> : ""}
                    {data.payment_status === "Cancel" ? <b className="text-danger">Cancel</b> : ""}
                  </td>
                  <td
                    className="p-4"
                    onClick={() => {
                      setIdTransaction(data.id);
                    }}
                  >
                    <DropdownStatus idTransaction={idTransaction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
}
