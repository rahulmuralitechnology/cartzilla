import { Flex, Segmented } from "antd";
import React, { FC } from "react";
import AbandonedCartsTable from "./AbandonedCartsTable";
import ActiveCartsTable from "./ActiveCarts";
import PendingPaymentCart from "./PendingPaymentCart";
import "../../styles/CartView.scss";

const CartView: FC = () => {
  const [viewCart, setViewCart] = React.useState("Abandoned");

  return (
    <section className='bloomi5_page carts_page'>
      <Flex justify='space-between' align='middle' style={{}}>
        <h2>Carts </h2>
      </Flex>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Segmented
          options={["Abandoned", "Active", "Pending"]}
          value={viewCart}
          onChange={setViewCart}
          block
          style={{ margin: "10px 0", height: 35, width: 400 }}
        />
      </div>

      {viewCart === "Abandoned" && <AbandonedCartsTable />}
      {viewCart === "Active" && <ActiveCartsTable />}
      {viewCart === "Pending" && <PendingPaymentCart />}
    </section>
  );
};

export default CartView;
