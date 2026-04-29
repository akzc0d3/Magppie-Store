import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";


export async function createOrder(cartItems) {
  const payload = cartItems.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  return apiRequest("/v1/order/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders() {
  return apiRequest("/v1/order/", {
    method: "GET",
  });
}


export async function getAllOrders() {
  return apiRequest("/v1/admin/orders", {
    method: "GET",
  });
}


export async function getOrderById(id) {
  const { user } = useAuthStore.getState();

  const isAdmin = user?.role === "admin";

  const endpoint = isAdmin
    ? `/v1/admin/orders/${id}`
    : `/v1/order/${id}`;

  return apiRequest(endpoint, {
    method: "GET",
  });
}
export async function updateOrderStatus(orderId, status) {

  
  return apiRequest(`/v1/admin/orders/${orderId}/${status}`, {
    method: "PATCH",
  });
}