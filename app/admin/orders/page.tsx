import { orderService } from "@/services";
import { OrdersView } from "@/components/admin/orders-view";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await orderService.getOrders();

  return <OrdersView initialOrders={orders} />;
}
