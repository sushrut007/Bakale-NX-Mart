"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(orders.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-8" style={{ color: "var(--primary)" }}>
        Orders
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Order ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Customer</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Total</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-r-8 border-transparent cursor-pointer outline-none transition-colors ${getStatusColor(order.status)} ${updating === order.id ? 'opacity-50' : ''}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-xs border border-gray-200">
                      {order.items?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden border-t border-gray-100 divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order.id} className="p-4 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-bold text-gray-900 leading-tight mb-1">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.customerPhone}</div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="font-black text-gray-900">₹{order.totalPrice.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] font-mono text-gray-400 mt-1">ID: {order.id.slice(0, 8)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="text-gray-500 font-medium">
                  {format(new Date(order.createdAt), "MMM d, yyyy")} • <span className="text-gray-900 font-bold">{order.items?.length || 0} items</span>
                </div>
              </div>
              <div className="mt-2 pt-3 border-t border-gray-50">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={updating === order.id}
                  className={`w-full text-xs font-bold uppercase tracking-wider px-3 py-3 rounded-xl border-r-8 border-transparent cursor-pointer outline-none transition-colors shadow-sm ${getStatusColor(order.status)} ${updating === order.id ? 'opacity-50' : ''}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
