export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/inventory":
      return ["name", "number"];
    case "/provider":
      return ["name", "number"];
    case "/contact":
      return ["name", "number", "bankProps", "mail"];
    case "/sleevesBids":
      return ["name", "number", "date", "tax", "quantity", "totalAmount"];
    default:
      return ["name", "number"];
  }
};
