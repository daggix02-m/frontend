import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {Skeleton} from "../ui/skeleton";
import managerService from "../../services/manager.service";

const PendingStockTransfersCard = () => {
  const [pendingCount, setPendingCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    managerService
      .getPendingStockTransfersCount()
      .then((count) => {
        if (isMounted) {
          setPendingCount(count);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to fetch pending transfers");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card className="p-6 flex flex-col items-center justify-center bg-white shadow rounded-lg min-w-[220px] min-h-[120px]">
      <div className="text-lg font-semibold mb-2 text-gray-700">Pending Stock Transfers</div>
      {loading ? (
        <Skeleton className="w-8 h-8 text-blue-500" />
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <div className="text-3xl font-bold text-blue-600">{pendingCount}</div>
      )}
    </Card>
  );
};

export default PendingStockTransfersCard;
