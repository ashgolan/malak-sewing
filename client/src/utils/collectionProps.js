export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/inventories":
      return ["name", "number"];
    case "/providers":
      return ["name", "number"];
    case "/contacts":
      return ["name", "number", "bankProps", "mail"];
    case "/sleevesBids":
      return ["clientName", "number", "date", "tax", "quantity", "totalAmount"];
    case "/workersExpenses":
      return ["clientName", "number", "date", "tax", "equipment", "location"];
    case "/institutionTax":
      return [
        "clientName",
        "number",
        "date",
        "taxNumber",
        "name",
        "withholdingTax",
        "paymentDate",
        "totalAmount",
      ];
    case "/expenses":
      return ["name", "number", "date", "taxPercent", "totalAmount"];
    case "/salesToCompanies":
      return ["name", "number", "date", "totalAmount"];
    case "/sales":
      return [
        "date",
        "clientName",
        "remark",
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
