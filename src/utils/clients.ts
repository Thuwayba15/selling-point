import { getAxiosInstance } from "@/lib/api";

// Interface for client dropdown option
export interface IClientOption {
  id: string;
  name: string;
}

// Fetch active clients for use in dropdowns
// Only returns clients where isActive=true
export async function fetchActiveClientsForDropdown(
  pageSize: number = 1000,
): Promise<IClientOption[]> {
  try {
    const api = getAxiosInstance();
    const { data } = await api.get("/api/clients", {
      params: {
        pageSize,
        isActive: true,
      },
    });

    const items = data.items || data || [];
    return items.map((client: { id: string; name: string }) => ({
      id: client.id,
      name: client.name,
    }));
  } catch (error) {
    return [];
  }
}
