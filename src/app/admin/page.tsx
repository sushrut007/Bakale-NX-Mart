"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders")
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const revenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);

        setStats({
          products: products.length || 0,
          orders: orders.length || 0,
          revenue: revenue || 0,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black mb-8" style={{ color: "var(--brand-maroon)" }}>Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
            <Package size={28} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Products</div>
            <div className="text-3xl font-black" style={{ color: "var(--brand-maroon)" }}>
              {loading ? "..." : stats.products}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-orange-50 text-orange-600">
            <ShoppingCart size={28} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</div>
            <div className="text-3xl font-black" style={{ color: "var(--brand-maroon)" }}>
              {loading ? "..." : stats.orders}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-50 text-green-600">
            <IndianRupee size={28} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</div>
            <div className="text-3xl font-black" style={{ color: "var(--brand-maroon)" }}>
              {loading ? "..." : `₹${stats.revenue.toLocaleString("en-IN")}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
