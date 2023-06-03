export default (http) => ({
  async load(token) {
    let { data } = await http.get("cart.php", {
      params: { token },
      errorAlert: {
        text: "при загрузке корзины",
        critical: true,
      },
    });

    return data;
  },
  async add(token, id) {
    let { data } = await http.post(
      "cart.php",
      { token, id },
      {
        errorAlert: "при добавлении товара",
      }
    );
    return data;
  },
  async remove(token, id) {
    let { data } = await http.delete("cart.php", {
      params: { token, id },
      errorAlert: "при удалении товара",
    });
    return data;
  },
  async change(token, id, cnt) {
    let { data } = await http.put(
      "cart.php",
      { token, id, cnt },
      {
        errorAlert: "при изменении количества товара",
      }
    );
    return data;
  },
});
