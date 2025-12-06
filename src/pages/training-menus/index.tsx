import { useState, useEffect } from "react";
import { TrainingMenu } from "@/types/training-menu";
import { TrainingMenuList } from "@/components/TrainingMenuList";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function TrainingMenuListPage() {
  const [menus, setMenus] = useState<TrainingMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchMenus();
  }, [user]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<TrainingMenu[]>("/api/training-menus");
      setMenus(data);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newMenus: TrainingMenu[]) => {
    // Optimistic update
    setMenus(newMenus);

    try {
      const items = newMenus.map((m) => ({
        id: m.id,
        sortOrder: m.sort_order,
      }));
      await apiClient.put("/api/training-menus/reorder", { items });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to save order:", err);
      setError("Failed to save order");
      fetchMenus(); // Revert to server state
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    // Optimistic update
    const updatedMenus = menus.map((m) => (m.id === id ? { ...m, status } : m));
    setMenus(updatedMenus);

    try {
      await apiClient.patch(`/api/training-menus/${id}`, { status });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError("Failed to update status");
      fetchMenus(); // Revert
    }
  };

  if (loading && menus.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content-wrapper" style={{ padding: "1rem" }}>
      <h1>トレーニングメニュー一覧</h1>
      <TrainingMenuList
        menus={menus}
        onReorder={handleReorder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
