import { MeResponse } from "@/features/sites/types/siteType"
import api from "@/lib/api"

const BASE_URL = "/site";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getMe = async (): Promise<MeResponse> => {
  const { data } = await api.get(
    `${BASE_URL}/user-access`
  );
  return data;
};

