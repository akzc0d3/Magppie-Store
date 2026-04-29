import { apiRequest } from "@/lib/api";

export async function searchProducts(params) {
  const query = new URLSearchParams();

  if (params.name) query.append("name", params.name);
  if (params.category) query.append("category", params.category);
  if (params.priceMin) query.append("priceMin", params.priceMin);
  if (params.priceMax) query.append("priceMax", params.priceMax);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  return apiRequest(`/v1/product/search?${query.toString()}`);
}