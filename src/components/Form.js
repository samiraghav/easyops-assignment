import React, { useState, useEffect } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import "./Form.css";

function Form() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("tableData"));
    if (savedData) {
      setTableData(savedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactNumber.length !== 10) {
      alert("Please enter a 10 digit mobile number!");
      return;
    }
    const newData = { firstName, lastName, contactNumber };
    const isDuplicate = tableData.some(
      (data) =>
        `${data.firstName} ${data.lastName}` ===
        `${newData.firstName} ${newData.lastName}`
    );
    if (isDuplicate) {
      alert("Person with the same name already exists!");
      return;
    }

    const hasDuplicateContactNumber = tableData.some(
      (data) => data.contactNumber === newData.contactNumber
    );
    if (hasDuplicateContactNumber) {
      alert("Person with the same contact number already exists!");
      return;
    }

    setTableData([...tableData, newData]);
    setFirstName("");
    setLastName("");
    setContactNumber("");
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const newData = [...tableData];
      newData.splice(index, 1);
      setTableData(newData);
    }
  };

  const filteredTableData = tableData.filter((data) =>
    `${data.firstName} ${data.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSort = () => {
    if (sortOrder === "asc") {
      const sortedData = [...tableData].sort((a, b) =>
        (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
      );
      setTableData(sortedData);
      setSortOrder("desc");
    } else {
      const sortedData = [...tableData].sort((a, b) =>
        (b.firstName + b.lastName).localeCompare(a.firstName + a.lastName)
      );
      setTableData(sortedData);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="">Person's Name</label>
            <div>
              <input
                type="text"
                id="firstName"
                placeholder="First"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                id="lastName"
                placeholder="Last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <div className="contact-container">
              <label htmlFor="contactNumber">Contact Number</label>
              <div>
                <input
                  type="tel"
                  id="contactNumber"
                  maxLength={10}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
      <div>
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-icon">
            {searchQuery.length > 0 ? (
              <FaTimes onClick={() => setSearchQuery("")} />
            ) : (
              <FaSearch />
            )}
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>SN.</th>
            <th onClick={handleSort}>Name</th>
            <th>Contact</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredTableData.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{`${data.firstName} ${data.lastName}`}</td>
              <td>{data.contactNumber}</td>
              <td>
                <FaTimes onClick={() => handleDelete(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Form;
