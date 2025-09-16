import type React from "react";
import { Table, Image, InputNumber, Typography, Divider, Card, Tag, Button, Space, Badge } from "antd";

import type { ColumnsType } from "antd/es/table";
import "./OrderDetailPage.scss";
import orderService, { Order } from "../../../../services/orderService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrderItem } from "../../../../services/interfaces/common";
import { CustomerOrderItem } from "../../../../services/interfaces/customerDetail";
import appConstant from "../../../../services/appConstant";

const { Text, Title } = Typography;

interface LineItem {
  key: string;
  productId: string;
  image: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface OrderLineItemsProps {
  orderTotal: number;
  orderSubtotal: number;
  orderTax: number;
  orderShipping: number;
  orderDiscount: number;
}

const OrderLineItems: React.FC<OrderLineItemsProps> = ({ orderTotal, orderSubtotal, orderTax, orderShipping, orderDiscount }) => {
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<CustomerOrderItem[]>([]);
  const params = useParams() as { orderId: string };

  const handleQuantityChange = (value: number | null, record: LineItem) => {
    console.log(`Changed quantity to ${value} for product ${record.productId}`);
    // In a real app, you would update the state and recalculate totals
  };

  const columns: ColumnsType<CustomerOrderItem> = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <div className='product-info'>
          <Image
            src={record?.productImages[0] || "/placeholder.svg"}
            alt={record.productName}
            width={60}
            height={60}
            className='product-image'
            fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
          />
          <div className='product-details'>
            <Text strong className='product-name'>
              {record.productName}
            </Text>
            {/* <Text type='secondary' className='product-sku'>
              SKU: {record.sku}
            </Text> */}
            <Text type='secondary' className='product-id'>
              ID: {record.productId}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Text>
          {appConstant.CURRENY_SYMBOL}
          {price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "Discount",
    //   dataIndex: "discount",
    //   key: "discount",
    //   render: (discount) => (discount > 0 ? <Text>${discount.toFixed(2)}</Text> : "-"),
    // },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total, orderItem: CustomerOrderItem) => (
        <Text strong>
          {appConstant.CURRENY_SYMBOL}
          {orderItem.totalPriceWithGST.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, orderItem: CustomerOrderItem) => {
        const statusColors = {
          "in-stock": "green",
          "low-stock": "orange",
          "out-of-stock": "red",
        };
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]} className='status-tag'>
            {orderItem.order.status}
          </Tag>
        );
      },
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space size='small'>
    //       <Button type='text' icon={<EditOutlined />} className='action-button' />
    //       <Button type='text' icon={<DeleteOutlined />} danger className='action-button' />
    //     </Space>
    //   ),
    // },
  ];

  const getOrderItems = async (id: string) => {
    setLoading(true);
    try {
      const result = await orderService.getOrderItemByOrderId(id);
      setOrderItems(result.data);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.orderId) {
      getOrderItems(params.orderId);
    }
  }, [params.orderId]);

  return (
    <div className='order-line-items'>
      <Card className='line-items-card' loading={loading}>
        <div className='card-header'>
          <Title level={4}>
            Order #{params.orderId} - Line Items <Badge count={orderItems.length} className='orders-count' />
          </Title>
        </div>

        <Table columns={columns} dataSource={orderItems} pagination={false} className='line-items-table' rowKey='key' />

        {/* <Divider />

        <div className='order-summary'>
          <div className='summary-row'>
            <Text>Subtotal:</Text>
            <Text>${orderSubtotal.toFixed(2)}</Text>
          </div>
          <div className='summary-row'>
            <Text>Discount:</Text>
            <Text>-${orderDiscount.toFixed(2)}</Text>
          </div>
          <div className='summary-row'>
            <Text>Shipping:</Text>
            <Text>${orderShipping.toFixed(2)}</Text>
          </div>
          <div className='summary-row'>
            <Text>Tax:</Text>
            <Text>${orderTax.toFixed(2)}</Text>
          </div>
          <Divider className='summary-divider' />
          <div className='summary-row total'>
            <Text strong>Total:</Text>
            <Text strong>${orderTotal.toFixed(2)}</Text>
          </div>
        </div> */}
      </Card>
    </div>
  );
};

export default OrderLineItems;
