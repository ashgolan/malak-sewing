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
    default:
      return ["name", "number"];
  }
};
