import { OpportunityDetails } from "../OpportunityDetails";
import { OpportunityActions } from "../OpportunityActions";
import { OpportunityStageHistory } from "../OpportunityStageHistory";
import { IOpportunity, IOpportunityStageHistory } from "@/providers/opportunities/context";

interface OverviewTabProps {
  opportunity: IOpportunity | null;
  stageHistory: IOpportunityStageHistory[];
  isLoadingDetails: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onUpdateStage: () => void;
  onAssign: () => void;
  className?: string;
  historyClassName?: string;
}

export const OverviewTab = ({
  opportunity,
  stageHistory,
  isLoadingDetails,
  onEdit,
  onDelete,
  onUpdateStage,
  onAssign,
  className,
  historyClassName,
}: OverviewTabProps) => {
  return (
    <>
      <div className={className}>
        <OpportunityDetails opportunity={opportunity} loading={isLoadingDetails} />
        {opportunity && (
          <OpportunityActions
            opportunity={opportunity}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStage={onUpdateStage}
            onAssign={onAssign}
          />
        )}
      </div>
      <div className={historyClassName}>
        <OpportunityStageHistory
          stageHistory={stageHistory}
          loading={isLoadingDetails}
          hasSelection={Boolean(opportunity)}
        />
      </div>
    </>
  );
};
