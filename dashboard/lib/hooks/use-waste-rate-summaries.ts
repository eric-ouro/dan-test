// hook that calculates summaries for waste rates from the use-waste-rates hook

import { useWasteRates } from "@/lib/hooks/use-waste-rates";
import {
  AsyncHookState,
  EnabledFilters,
  WasteRateSummary,
  WasteType,
} from "@/lib/types";

const withPercentage = (data: WasteRateSummary) => {
  // calculate percentage
  const percentage =
    data.quantity > 0 ? (data.recycled / data.quantity) * 100 : 0;

  return {
    ...data,
    percentage,
  };
};

export const useWasteRateSummaries = ({
  filters = [],
}: EnabledFilters): AsyncHookState<WasteRateSummary> => {
  const { data, error, loading } = useWasteRates({ filters });

  const summaries: Record<WasteType["id"], WasteRateSummary> = {};

  // for each waste rate, add the processed, quantity, and recycled to the summaries
  data.forEach((wasteRate) => {
    const { processed, recycled, wastetype } = wasteRate;
    summaries[wastetype] ??= {
      label: wastetype,
      processed: 0,
      quantity: 0,
      recycled: 0,
      percentage: 0,
    };

    // add processed and recycled to existing values
    summaries[wastetype] = {
      ...summaries[wastetype],
      processed: summaries[wastetype].processed + processed,
      recycled: summaries[wastetype].recycled + recycled,
      quantity: summaries[wastetype].quantity + processed + recycled,
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
