import http from "@/api/http";

export async function all() {
  let { data } = await http.get("orders.php", {
    errorAlert: "при получении списка заказов",
  });
  return data;
}
