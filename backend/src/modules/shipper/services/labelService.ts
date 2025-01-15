import { getLabelsFromDBError } from "../repository/errors";
import { getLabelsFromDB } from "../repository/labelRepository";

export const getAllLabels = async () => {
  try {
    const labels = await getLabelsFromDB();
    return labels;
  } catch {
    throw new Error(getLabelsFromDBError);
  }
};
