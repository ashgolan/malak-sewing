import React from "react";

export default function BidTitles(setBid,bid,saveBidHandler) {
  return (
    <form onSubmit={saveBidHandler} className="header_container">
      <input
        className="name"
        required
        type="text"
        placeholder="שם"
        value={bid.clientName}
        onChange={(e) => {
          setBid((prev) => {
            return { ...prev, clientName: e.target.value };
          });
        }}
      />

      <input
        required
        className="date"
        type="date"
        placeholder="תאריך"
        value={bid.date}
        onChange={(e) => {
          setBid((prev) => {
            return { ...prev, date: e.target.value };
          });
        }}
      />

      <input
        className="name"
        placeholder="צבע"
        value={bid.color}
        required
        onChange={(e) => {
          setBid((prev) => {
            return { ...prev, color: e.target.value };
          });
        }}
      />
      <h4 className="totalAmount">סכום ההצעה</h4>
      <input
        style={{
          width: "9.5%",
          textAlign: "center",
          fontWeight: "bold",
          border: "none",
        }}
        className="name"
        placeholder='סה"כ'
        required
        defaultValue={0}
      />
      <h4>ש"ח</h4>

      <input type="submit" className="save" value="שמירה" />
    </form>
  );
}
