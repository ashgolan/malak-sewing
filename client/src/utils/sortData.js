export const sortedInventory = (data, kindOfSort) => {
  switch (kindOfSort) {
    case "number":
      return data?.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
    case "clientName":
      return data?.sort((a, b) => (a.clientName > b.clientName ? 1 : -1));
    case "kindOfWork":
      return data?.sort((a, b) => (a.kindOfWork > b.kindOfWork ? 1 : -1));
    case "sending":
      return data?.sort((a, b) => (a.sending > b.sending ? 1 : -1));
    case "afterTax":
      return data?.sort((a, b) => (a.afterTax > b.afterTax ? 1 : -1));
    case "containersNumbers":
      return data?.sort((a, b) => (a.containersNumbers > b.containersNumbers ? 1 : -1));
    case "totalAmount":
      return data?.sort(
        (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
      );
    case "discount":
      return data?.sort(
        (a, b) => parseFloat(a.discount) - parseFloat(b.discount)
      );
    case "sale":
      return data?.sort((a, b) => parseFloat(a.sale) - parseFloat(b.sale));
    case "expenses":
      return data?.sort(
        (a, b) => parseFloat(a.expenses) - parseFloat(b.expenses)
      );
    case "withholdingTax":
      return data?.sort(
        (a, b) => parseFloat(a.expenses) - parseFloat(b.expenses)
      );
    case "quantity":
      return data?.sort(
        (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
      );
    case "name":
      return data?.sort((a, b) => (a.name > b.name ? 1 : -1));
    case "tax":
      return data?.sort((a, b) => (a.tax > b.tax ? 1 : -1));
    case "taxNumber":
      return data?.sort((a, b) => (a.taxNumber > b.taxNumber ? 1 : -1));
    case "checkNumber":
      return data?.sort((a, b) => (a.taxNumber > b.taxNumber ? 1 : -1));
    case "bankNumber":
      return data?.sort((a, b) => (a.taxNumber > b.taxNumber ? 1 : -1));
    case "branchNumber":
      return data?.sort((a, b) => (a.taxNumber > b.taxNumber ? 1 : -1));
    case "accountNumber":
      return data?.sort((a, b) => (a.taxNumber > b.taxNumber ? 1 : -1));
    case "location":
      return data?.sort((a, b) => (a.location > b.location ? 1 : -1));
    case "equipment":
      return data?.sort((a, b) => (a.equipment > b.equipment ? 1 : -1));
    case "date":
      return data?.sort((a, b) => (a.date > b.date ? 1 : -1));
    case "paymentDate":
      return data?.sort((a, b) => (a.paymentDate > b.paymentDate ? 1 : -1));
    case "mail":
      return data?.sort((a, b) => (a.mail > b.mail ? 1 : -1));
    case "bankProps":
      return data?.sort((a, b) => (a.bankProps > b.bankProps ? 1 : -1));
    default:
      return data?.sort((a, b) => (a.date > b.date ? 1 : -1));
  }
};
