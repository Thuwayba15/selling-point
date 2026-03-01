/**
 * Form value type definitions for all forms in the application
 */

import type { Dayjs } from "dayjs";
import type { UserRole } from "@/providers/auth/context";

/**
 * Contact Form Values
 * Used in: ContactForm component, contacts page
 */
export interface ContactFormValues {
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  isPrimaryContact?: boolean;
}

/**
 * Client Form Values
 * Used in: ClientForm component
 */
export interface ClientFormValues {
  name: string;
  clientType: number | string;
  industry?: string;
  companySize?: string;
  billingAddress?: string;
  shippingAddress?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  isActive?: boolean;
  notes?: string;
}

/**
 * Opportunity Form Values
 * Used in: OpportunityForm component
 */
export interface OpportunityFormValues {
  title: string;
  clientId: string;
  contactId?: string;
  estimatedValue: number | string;
  currency: string;
  stage: number | string;
  source: number | string;
  probability: number | string;
  expectedCloseDate?: string;
  description?: string;
}

/**
 * Pricing Request Form Values
 * Used in: PricingRequestForm component
 */
export interface PricingRequestFormValues {
  opportunityId: string;
  status: number | string;
  priority: number | string;
  description: string;
  requiredByDate: string;
  estimatedValue: number | string;
  currency: string;
  notes?: string;
}

/**
 * Contract Form Values (raw form values with Dayjs dates)
 * Used in: ContractForm component for form submission
 */
export interface ContractFormValues {
  title: string;
  clientId: string;
  opportunityId?: string;
  proposalId?: string;
  contractNumber?: string;
  contractType?: string;
  startDate: Dayjs | string;
  endDate: Dayjs | string;
  value: number | string;
  currency: string;
  status?: number | string;
  terms?: string;
  notes?: string;
  autoRenew?: boolean;
  renewalNoticeDays?: number | string;
  ownerId?: string;
}

/**
 * Proposal Form Values
 * Used in: ProposalForm component main form
 */
export interface ProposalFormValues {
  title: string;
  clientId: string;
  opportunityId?: string;
  status?: number | string;
  description?: string;
  currency: string;
  validUntil?: Dayjs | string;
  notes?: string;
}

/**
 * Proposal Line Item Form Values
 * Used in: ProposalForm component for adding line items
 */
export interface ProposalLineItemFormValues {
  productServiceName: string;
  description?: string;
  quantity: number | string;
  unitPrice: number | string;
  discount?: number | string;
  taxRate?: number | string;
}

/**
 * Registration Form Values
 * Used in: RegisterForm component
 */
export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  tenantName?: string;
  tenantId?: string;
  role?: UserRole;
}

/**
 * Activity Participant Form Values
 */
export interface ActivityParticipantFormValues {
  userId?: string;
  contactId?: string;
  isRequired: boolean;
}

/**
 * Activity Form Values
 * Used in: ActivityForm component
 */
export interface ActivityFormValues {
  subject: string;
  type: number;
  priority: number;
  dueDate: Dayjs | string;
  assignedToId: string;
  relatedToType?: number;
  relatedToId?: string;
  duration?: number;
  location?: string;
  description?: string;
  participants?: ActivityParticipantFormValues[];
}
