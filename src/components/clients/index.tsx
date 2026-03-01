export { ClientsHeader } from "./ClientsHeader";
export { ClientsFilters } from "./ClientsFilters";
export { ClientsTable, type Client } from "./ClientsTable";
export { ClientDetails } from "./ClientDetails";
export { ClientStatsComponent } from "./ClientStats";
export { ClientActions } from "./ClientActions";
export { ClientForm } from "./ClientForm";

// Workspace components
export { ClientWorkspaceContent } from "./ClientWorkspaceContent";

// Tabs
export { ContactsTab } from "./tabs/ContactsTab";
export { OpportunitiesTab } from "./tabs/OpportunitiesTab";
export { ContractsTab } from "./tabs/ContractsTab";
export { DocumentsTab } from "./tabs/DocumentsTab";
export { NotesTab } from "./tabs/NotesTab";

// Modals
export { CreateOpportunityModal } from "./modals/CreateOpportunityModal";
export { CreateContactModal } from "./modals/CreateContactModal";
export { EditContactModal } from "./modals/EditContactModal";
export { EntityModalsRenderer } from "./modals/EntityModalsRenderer";

// Hooks
export { useClientWorkspaceData } from "./hooks/useClientWorkspaceData";
export { useClientEntityModals, type EntityType } from "./hooks/useClientEntityModals";
