type ProposalLineItemForTotals = {
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  taxRate?: number;
};

export interface ProposalTotals {
  subtotal: number;
  tax: number;
  totalAmount: number;
}

/**
 * Calculate proposal totals from line items
 * @param lineItems - Array of proposal line items
 * @returns Object containing subtotal, tax, and totalAmount
 */
export const calculateProposalTotals = (
  lineItems: ProposalLineItemForTotals[],
): ProposalTotals => {
  let subtotal = 0;
  let totalTax = 0;
  let totalAmount = 0;

  lineItems.forEach((item) => {
    if (item.quantity && item.unitPrice) {
      // Calculate before-discount amount
      const itemSubtotal = item.quantity * item.unitPrice;
      
      // Apply discount
      const discount = item.discount || 0;
      const discountAmount = itemSubtotal * (discount / 100);
      const afterDiscount = itemSubtotal - discountAmount;
      
      // Calculate and apply tax
      const taxRate = item.taxRate || 0;
      const itemTax = afterDiscount * (taxRate / 100);
      const itemTotal = afterDiscount + itemTax;

      subtotal += afterDiscount;  // Subtotal after discount, before tax
      totalTax += itemTax;
      totalAmount += itemTotal;
    }
  });

  return {
    subtotal,
    tax: totalTax,
    totalAmount,
  };
};
