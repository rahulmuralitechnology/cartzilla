import { FC } from "react";
import { List, Card, Space, Tag, Button, Dropdown, Avatar, Skeleton, Typography, Col, Row } from "antd";
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { IProduct, ProductStatus } from "../../services/productService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { DEFAULT_THEME } from "../../theme/defaultTheme";
import appConstant from "../../services/appConstant";
import { truncateString } from "../../services/utils";

interface ProductListProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ProductStatus) => void;
  loading: boolean;
}

const ProductList: FC<ProductListProps> = ({ products, onEdit, onDelete, onStatusChange, loading }) => {
  const getStatusColor = (status: string) => (status === "PUBLISHED" ? "green" : "orange");
  const getAvailabilityColor = (status: string) => (status === "IN_STOCK" ? "green" : "orange");
  const { selectedStore } = useSelector((state: RootState) => state.store);

  return (
    <List
      // grid={{ gutter: 16, xs: 1, sm: 1, md: 3, lg: 3, xl: 1, xxl: 1 }}
      dataSource={products}
      loading={loading}
      pagination={{
        total: products.length,
        defaultCurrent: 1,
        defaultPageSize: 5,
      }}
      itemLayout='horizontal'
      renderItem={(product) => (
        <List.Item
          actions={[
            <Button
              key='edit'
              type='primary'
              icon={<EditOutlined style={{ color: "var(--text-tertiary-color)" }} />}
              onClick={() => onEdit(product)}
            />,
            <Dropdown
              key='more'
              menu={{
                items: [
                  // {
                  //   key: "status",
                  //   label: product.status === "published" ? "Unpublish" : "Publish",
                  //   onClick: () => onStatusChange(product.id as string, product.status === "published" ? "draft" : "published"),
                  // },
                  {
                    key: "delete",
                    label: "Delete",
                    danger: true,
                    onClick: () => onDelete(product.id as string),
                  },
                ],
              }}>
              <Button type='primary' icon={<EllipsisOutlined style={{ color: "var(--text-tertiary-color)" }} />} />
            </Dropdown>,
          ]}>
          <Skeleton avatar title={false} loading={loading} active>
            <List.Item.Meta
              avatar={<Avatar src={product.images ? product?.images[0] : ""} />}
              title={
                <Space direction='horizontal'>
                  <h3 style={{ color: "var(--text-primary-color)" }}>{product.title}</h3>
                  {selectedStore?.storeCategory !== "ecom_interior_template" && (
                    <Tag color='blue'>
                      {appConstant.CURRENY_SYMBOL}
                      {product?.price?.toFixed(2)}
                    </Tag>
                  )}
                  <Tag color='orange'>{product.category}</Tag>
                </Space>
              }
              description={
                <Space direction='vertical'>
                  {product?.variants && (
                    <div>
                      {product?.variants?.map((variant, i) => (
                        <Tag key={i} color='magenta'>
                          {variant.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                  <span>{truncateString(product.description, 50)}</span>
                </Space>
              }
            />
            <Space direction='vertical'>
              <Space>
                <Tag color={getStatusColor(product.status)}>{product.status?.toUpperCase()}</Tag>
                {selectedStore?.storeCategory !== "ecom_interior_template" && (
                  <Tag color={getAvailabilityColor(product.availabilityStatus)}>
                    {product.availabilityStatus ? "Available" : "Not-Available"}
                  </Tag>
                )}
              </Space>
            </Space>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default ProductList;
