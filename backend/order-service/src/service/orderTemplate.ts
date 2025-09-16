import { Address, Order, OrderItem, Store } from "@prisma/client";

interface ShippingLabelInterface {
  storeAddress: string;
  storePhone: string;
  companyName: string;
  companyLogo: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  orderNumber: string;
  orderDate: string;
  weight?: string;
}

export const generateOrderShippingLabel = (shippingInfo: ShippingLabelInterface) => {
  return `
 <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .label-box { border: 2px dashed #000; padding: 20px; width: 450px; }
          .section { margin-bottom: 15px; }
          .logo { max-width: 120px; margin-bottom: 10px; }
          .header { display: flex; align-items: center; gap: 15px; }
        </style>
      </head>
      <body>
        <div class="label-box">

          <div class="section">
            <h3>To:</h3>
            <p>
              ${shippingInfo.customerName}<br>
              ${shippingInfo.customerAddress}<br>
            </p>
          </div>


          <div class="header">
            <div>
            <h3>From:</h3>
              <h2>${shippingInfo.companyName}</h2>
              <p>${shippingInfo.storeAddress}<br>Phone: ${shippingInfo.storePhone}</p>
            </div>
          </div>

     

          <div class="section">
            <h3>Order Info:</h3>
            <p>
              Order #: <strong>${shippingInfo.orderNumber}</strong><br>
              Order Date: ${shippingInfo.orderDate}<br>
              Weight: ${shippingInfo.weight || "--"}
            </p>
          </div>
        </div>
      </body>
    </html>

    
    
    `;
};

export interface InvoiceInterface {
  items: OrderItem[];
  shippingCost: number;
  store: {
    name: string;
    logo: string;
  };
  storeAddress: string;
  storePhone: string;
  shippingAddress: Address;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  totalAmount: number;
  orderNumber: string;
  orderDate: string;
}

export const generateOrderInvoice = (order: InvoiceInterface) => {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td>${item.productName}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");
  return `
 <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .invoice-box { border: 1px solid #eee; padding: 20px; width: 600px; }
          .header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
          .logo { max-width: 100px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .total-row td { font-weight: bold; }
          .small-gray { font-size: 12px; color: #888; margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <img class="logo" src="${order.store.logo}" alt="Logo" />
            <div>
              <h2>${order.store.name}</h2>
              <p>${order.storeAddress}<br/>Phone: ${order.storePhone}</p>
            </div>
          </div>

          <p><strong>Invoice To:</strong><br/>
          ${order.customerName}<br/>
          ${order.customerAddress}<br/>
    

          <p><strong>Order #: </strong>${order.orderNumber}<br/>
          <strong>Date:</strong> ${order.orderDate}</p>

          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${itemRows}
              <tr>
                <td colspan="3">Shipping Charges</td>
                <td>${order.shippingCost.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">
                  <span class="small-gray">Inclusive all taxes and charges</span>
                  Total
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>

`;
};
