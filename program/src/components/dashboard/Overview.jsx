import React, { useEffect, useState } from "react";
import Card from "../ui/card";
import LowStockAlert from "./LowStockAlert";
import NearToExpireAlert from "./NearToExpireAlert";
// Import services or use mock data
// import { getLowStockAlerts, getNearToExpireAlerts } from "../../services/manager.service";

const Overview = () => {
  // Mock data for demonstration; replace with service calls when available
  const [lowStockCount, setLowStockCount] = useState(0);
  const [nearExpireCount, setNearExpireCount] = useState(0);
  const [lowStockPreview, setLowStockPreview] = useState([]);
  const [nearExpirePreview, setNearExpirePreview] = useState([]);

  useEffect(() => {
    // Replace with actual service calls
    // getLowStockAlerts().then(data => { setLowStockCount(data.count); setLowStockPreview(data.preview); });
    // getNearToExpireAlerts().then(data => { setNearExpireCount(data.count); setNearExpirePreview(data.preview); });

    // Mock data
    setLowStockCount(5);
    setNearExpireCount(3);
    setLowStockPreview([
      { id: 1, name: "Product A", stock: 2 },
      { id: 2, name: "Product B", stock: 1 },
    ]);
    setNearExpirePreview([
      { id: 1, name: "Product X", expiresIn: "2 days" },
      { id: 2, name: "Product Y", expiresIn: "5 days" },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Low Stock Alerts Card */}
      <Card>
        <div className="flex flex-col h-full">
          <div className="font-semibold text-lg mb-2">Low Stock Alerts</div>
          <div className="text-sm mb-2">
            Products with low stock:{" "}
            <span className="font-bold">{lowStockCount}</span>
          </div>
          <LowStockAlert preview={lowStockPreview} />
          <div className="mt-auto pt-2">
            <a
              href="/manager/low-stock"
              className="text-blue-600 hover:underline text-sm"
            >
              View all low stock items
            </a>
          </div>
        </div>
      </Card>

      {/* Near to Expire Alerts Card */}
      <Card>
        <div className="flex flex-col h-full">
          <div className="font-semibold text-lg mb-2">Near to Expire Alerts</div>
          <div className="text-sm mb-2">
            Products nearing expiration:{" "}
            <span className="font-bold">{nearExpireCount}</span>
          </div>
          <NearToExpireAlert preview={nearExpirePreview} />
          <div className="mt-auto pt-2">
            <a
              href="/manager/near-expire"
              className="text-blue-600 hover:underline text-sm"
            >
              View all near-to-expire items
            </a>
          </div>
        </div>
      </Card>

      {/* ...existing code... */}
    </div>
  );
};

export default Overview;