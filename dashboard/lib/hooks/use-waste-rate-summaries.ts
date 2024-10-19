// hook that calculates summaries for waste rates from the use-waste-rates hook

import { useWasteRates } from "@/lib/hooks/use-waste-rates";
import {
  AsyncHookState,
  EnabledFilters,
  SummaryData,
  WasteRateSummary,
  WasteType,
} from "@/lib/types";

const wasteRateSummaryFromData = (
  wasteType: WasteType["id"],
  data: SummaryData,
) => {
  // calculate percentage
  const percentage =
    data.quantity > 0 ? (data.recycled / data.quantity) * 100 : 0;

  return {
    label: wasteType,
    ...data,
    percentage,
  };
};

export const useWasteRateSummaries = ({
  filters = [],
}: EnabledFilters): AsyncHookState<WasteRateSummary> => {
  const { data, error, loading } = useWasteRates({ filters });

  const summaries: Record<WasteType["id"], SummaryData> = {};

  // for each waste rate, add the processed, quantity, and recycled to the summaries
  data.forEach((wasteRate) => {
    const { processed, recycled, wastetype } = wasteRate;
    summaries[wastetype] ??= { processed: 0, quantity: 0, recycled: 0 };

    // add processed and recycled to existing values
    summaries[wastetype] = {
      processed: summaries[wastetype].processed + processed,
      recycled: summaries[wastetype].recycled + recycled,
      quantity: summaries[wastetype].quantity + processed + recycled,
    };
  });

  return {
    data: Object.entries(summaries)
      .map(([wasteType, data]) =>
        wasteRateSummaryFromData(Number(wasteType), data),
      )
      .sort((a, b) => b.quantity - a.quantity),
    error,
    loading,
  };
};
