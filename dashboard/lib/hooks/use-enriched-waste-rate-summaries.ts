// hook that calculates summaries for waste rates from the use-enriched-waste-rates hook

import { useEnrichedWasteRates } from "@/lib/hooks/use-enriched-waste-rates";
import {
  AsyncHookState,
  EnabledFilters,
  EnrichedWasteRate,
  EnrichedWasteRateSummary,
  EnrichedWasteRateSummaryWithRatios,
  GroupConfig,
} from "@/lib/types";

const withPercentage = (data: EnrichedWasteRateSummary) => {
  // calculate percentage
  const percentage =
    data.quantity > 0 ? (data.recycled / data.accounted) * 100 : 0;

  return {
    ...data,
    percentage,
  };
};

const mergeSummaries = (summaries: EnrichedWasteRateSummary[]) => {
  return summaries.reduce(
    (acc, curr) => {
      acc.processed += curr.processed;
      acc.recycled += curr.recycled;
      acc.quantity += curr.quantity;
      acc.accounted += curr.accounted;
      return acc;
    },
    {
      label: {
        id: parseInt(summaries[0].group),
        name: summaries[0].groupName,
      },
      group: summaries[0].group,
      groupName: summaries[0].groupName,
      processed: 0,
      quantity: 0,
      accounted: 0,
      recycled: 0,
      percentage: 0,
    },
  );
};

export const useEnrichedWasteRateSummaries = ({
  filters = [],
  groupConfig = {
    group: "none",
    aggregate: false,
  },
}: EnabledFilters & {
  groupConfig: GroupConfig;
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
    switch (groupConfig.group) {
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
    switch (groupConfig.group) {
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
    console.log(wasteRate);
    const { processed, recycled, wastetype, quantity, accounted } = wasteRate;
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
      accounted: 0,
      recycled: 0,
      percentage: 0,
    };

    // add processed and recycled to existing values
    summaries[groupKey][wastetype.id] = {
      ...summaries[groupKey][wastetype.id],
      processed: summaries[groupKey][wastetype.id].processed + processed,
      recycled: summaries[groupKey][wastetype.id].recycled + recycled,
      quantity:
        summaries[groupKey][wastetype.id].quantity + quantity,
      accounted:
        summaries[groupKey][wastetype.id].accounted + accounted,
    };
  });

  if (groupConfig.aggregate) {
    const data = Object.values(summaries)
      .map((group) => withPercentage(mergeSummaries(Object.values(group))))
      .sort((a, b) => b.quantity - a.quantity);

    return {
      data,
      error,
      loading,
    };
  }

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
  groupConfig = {
    group: "none",
    aggregate: false,
  },
}: EnabledFilters & {
  groupConfig: GroupConfig;
}): AsyncHookState<EnrichedWasteRateSummaryWithRatios> => {
  const { data, error, loading } = useEnrichedWasteRateSummaries({
    filters,
    groupConfig,
  });

  const calculateItemRatios = (
    item: EnrichedWasteRateSummary,
  ): EnrichedWasteRateSummaryWithRatios => {
    const recycleRate = item.recycled
      ? (item.recycled / item.accounted) * 100
      : 0;
    const recyclingLossQuantity = item.processed - item.recycled;
    const recyclingLossRate = (recyclingLossQuantity / item.accounted) * 100;
    const processingLoss = item.accounted - item.processed;
    const processingLossRate = (processingLoss / item.accounted) * 100;
    const accountedRate = item.accounted
      ? (item.accounted / item.quantity) * 100
      : 0;

    return {
      ...item,
      recycleRate,
      recyclingLossQuantity,
      recyclingLossRate,
      processingLoss,
      processingLossRate,
      accountedRate,
    };
  };

  return {
    data: data.map((summary) => calculateItemRatios(summary)),
    error,
    loading,
  };
};
