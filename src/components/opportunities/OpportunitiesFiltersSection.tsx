"use client";

import { Button } from "antd";
import { OpportunitiesFilters } from "@/components/opportunities";
import { useStyles } from "@/components/opportunities/style";

interface OpportunitiesFiltersSectionProps {
  onCreateClick: () => void;
  onApplyFilters: (filters: {
    searchTerm?: string;
    clientId?: string;
    stage?: number;
    ownerId?: string;
  }) => void;
  onClear: () => void;
  clients: Array<{ id: string; name: string }>;
  showMyOpportunities: boolean;
  onShowMyOpportunitiesChange: (value: boolean) => void;
  showMyOpportunitiesToggle: boolean;
  initialSearchTerm: string;
  initialClientId?: string;
  initialStage?: number;
  initialOwnerId?: string;
  opportunityId?: string;
  onBackToList: () => void;
}

export const OpportunitiesFiltersSection = ({
  onCreateClick,
  onApplyFilters,
  onClear,
  clients,
  showMyOpportunities,
  onShowMyOpportunitiesChange,
  showMyOpportunitiesToggle,
  initialSearchTerm,
  initialClientId,
  initialStage,
  initialOwnerId,
  opportunityId,
  onBackToList,
}: OpportunitiesFiltersSectionProps) => {
  const { styles } = useStyles();

  return (
    <>
      <div className={styles.sectionSpacing}>
        <Button onClick={onBackToList}>Back to Opportunities List</Button>
      </div>

      <OpportunitiesFilters
        key={`filters-${initialSearchTerm || ""}-${initialClientId || ""}-${initialStage || ""}-${initialOwnerId || ""}-${showMyOpportunities ? "1" : "0"}`}
        onApplyFilters={onApplyFilters}
        onClear={onClear}
        clients={clients}
        showMyOpportunities={showMyOpportunities}
        onShowMyOpportunitiesChange={onShowMyOpportunitiesChange}
        showMyOpportunitiesToggle={showMyOpportunitiesToggle}
        initialSearchTerm={initialSearchTerm}
        initialClientId={initialClientId}
        initialStage={initialStage}
        initialOwnerId={initialOwnerId}
      />
    </>
  );
};
