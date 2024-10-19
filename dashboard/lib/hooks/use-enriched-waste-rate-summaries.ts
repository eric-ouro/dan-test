// hook that calculates summaries for waste rates from the use-enriched-waste-rates hook

import { useEnrichedWasteRates } from "@/lib/hooks/use-enriched-waste-rates";
import {
  AsyncHookState,
  EnabledFilters,
  EnrichedWasteRateSummary,
  WasteType,
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
}: EnabledFilters): AsyncHookState<EnrichedWasteRateSummary> => {
  const { data, error, loading } = useEnrichedWasteRates({
    filters,
  });

  const summaries: Record<WasteType["id"], EnrichedWasteRateSummary> = {};

  // for each waste rate, add the processed, quantity, and recycled to the summaries
  data.forEach((wasteRate) => {
    const { processed, recycled, wastetype } = wasteRate;
    summaries[wastetype.id] ??= {
      label: wastetype,
      processed: 0,
      quantity: 0,
      recycled: 0,
      percentage: 0,
    };

    // add processed and recycled to existing values
    summaries[wastetype.id] = {
      ...summaries[wastetype.id],
      processed: summaries[wastetype.id].processed + processed,
      recycled: summaries[wastetype.id].recycled + recycled,
      quantity: summaries[wastetype.id].quantity + processed + recycled,
    };
  });

  return {
    data: Object.values(summaries)
      .map((summary) => withPercentage(summary))
      .sort((a, b) => b.quantity - a.quantity),
    error,
    loading,
  };
};
