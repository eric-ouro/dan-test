// hook that calculates summaries for waste rates from the use-enriched-waste-rates hook

import { useEnrichedWasteRates } from "@/lib/hooks/use-enriched-waste-rates";
import {
  AsyncHookState,
  EnabledFilters,
  EnrichedWasteRate,
  EnrichedWasteRateSummary,
  EnrichedWasteRateSummaryWithRatios,
  GroupType,
} from "@/lib/types";

const withPercentage = (data: EnrichedWasteRateSummary) => {
  // calculate percentage
  const percentage =
    data.quantity > 0 ? (data.recycled / data.quantity) * 100 : 0;

  return {
    ...data,
    percentage,
  };
};

export const useEnrichedWasteRateSummaries = ({
  filters = [],
  group = "none",
}: EnabledFilters & {
  group: GroupType;
}): AsyncHookState<EnrichedWasteRateSummary> => {
  const { data, error, loading } = useEnrichedWasteRates({
    filters,
  });

  // summaries are organized by group and then by waste type
  const summaries: Record<
    string,
    Record<string, EnrichedWasteRateSummary>
  > = {};

  const getGroupKey = (wasteRate: EnrichedWasteRate) => {
    const { facility, partnerfacility, partnercompany } = wasteRate;
    // case statements to return the correct key for the group
    switch (group) {
      case "facility":
        return facility.id;
      case "partnerfacility":
        return partnerfacility.id;
      case "partner":
        return partnercompany.id;
      default:
        return -1;
    }
  };

  const getGroupName = (wasteRate: EnrichedWasteRate) => {
    const { facility, partnerfacility, partnercompany } = wasteRate;
    switch (group) {
      case "facility":
        return facility.name;
      case "partnerfacility":
        return partnerfacility.name;
      case "partner":
        return partnercompany.name;
      default:
        return "";
    }
  };

  // for each waste rate, add the processed, quantity, and recycled to the summaries
  data.forEach((wasteRate) => {
    const { processed, recycled, wastetype } = wasteRate;
    const groupKey = getGroupKey(wasteRate);
    // initialize the waste type summary if it doesn't exist
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    summaries[groupKey] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    summaries[groupKey][wastetype.id] ??= {
      label: wastetype,
      group: groupKey.toString(),
      groupName: getGroupName(wasteRate),
      processed: 0,
      quantity: 0,
      recycled: 0,
      percentage: 0,
    };

    // add processed and recycled to existing values
    summaries[groupKey][wastetype.id] = {
      ...summaries[groupKey][wastetype.id],
      processed: summaries[groupKey][wastetype.id].processed + processed,
      recycled: summaries[groupKey][wastetype.id].recycled + recycled,
      quantity:
        summaries[groupKey][wastetype.id].quantity + processed + recycled,
    };
  });

  return {
    data: Object.values(summaries)
      .flatMap((group) =>
        Object.values(group).map((summary) => withPercentage(summary)),
      )
      .sort((a, b) => b.quantity - a.quantity),
    error,
    loading,
  };
};

export const useEnrichedWasteRateSummariesWithRatios = ({
  filters = [],
  group = "none",
}: EnabledFilters & {
  group: GroupType;
}): AsyncHookState<EnrichedWasteRateSummaryWithRatios> => {
  const { data, error, loading } = useEnrichedWasteRateSummaries({
    filters,
    group,
  });

  const calculateItemRatios = (
    item: EnrichedWasteRateSummary,
  ): EnrichedWasteRateSummaryWithRatios => {
    const recycleRate = item.recycled
      ? (item.recycled / item.quantity) * 100
      : 0;
    const recyclingLossQuantity = item.processed - item.recycled;
    const recyclingLossRate = (recyclingLossQuantity / item.quantity) * 100;
    const processingLoss = item.quantity - item.processed;
    const processingLossRate = (processingLoss / item.quantity) * 100;

    return {
      ...item,
      recycleRate,
      recyclingLossQuantity,
      recyclingLossRate,
      processingLoss,
      processingLossRate,
    };
  };

  return {
    data: data.map((summary) => calculateItemRatios(summary)),
    error,
    loading,
  };
};
