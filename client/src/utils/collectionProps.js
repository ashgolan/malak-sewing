export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/inventories":
      return ["name", "number"];
    case "/providers":
      return ["name", "number"];
    case "/contacts":
      return ["name", "number", "bankProps", "mail"];
    case "/sleevesBids":
      return ["name", "number", "date", "tax", "quantity", "totalAmount"];
    case "/workersExpenses":
      return ["clientName", "number", "date", "tax", "equipment", "location"];
    case "/expenses":
      return ["name", "number", "date", "taxPercent", "totalAmount"];
    case "/sales":
      return [
        "date",
        "clientName",
        "number",
        "tax",
        "name",
        "price",
        "sale",
        "discount",
        "expenses",
        "totalAmount",
      ];
    default:
      return false;
  }
};
