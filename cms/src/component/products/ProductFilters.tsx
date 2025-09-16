import { FC } from "react";
import { Space, Input, Select, Radio } from "antd";
import { IProductFilters } from "../../store/types/product";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ProductFiltersProps {
  filters: IProductFilters;
  onFilterChange: (filters: Partial<IProductFilters>) => void;
}

const ProductFilters: FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const { productCategory } = useSelector((state: RootState) => state.product);
  return (
    <Space wrap className='filter-inputs'>
      <Input.Search
        placeholder='Search products'
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        style={{ width: 200 }}
      />

      <Select
        placeholder='Category'
        value={filters.category}
        onChange={(value) => onFilterChange({ category: value })}
        style={{ width: 120 }}
        allowClear>
        {productCategory.map((c, i) => (
          <Select.Option value={c.name} key={i}>
            {c.name}
          </Select.Option>
        ))}
      </Select>

      <Radio.Group value={filters.status} onChange={(e) => onFilterChange({ status: e.target.value })}>
        <Radio.Button value='all'>All</Radio.Button>
        <Radio.Button value='published'>Published</Radio.Button>
        <Radio.Button value='draft'>Draft</Radio.Button>
      </Radio.Group>

      {/* <Select value={filters.sortBy} onChange={(value) => onFilterChange({ sortBy: value })} style={{ width: 120 }}>
        <Select.Option value='name'>Name</Select.Option>
        <Select.Option value='price'>Price</Select.Option>
        <Select.Option value='date'>Date</Select.Option>
      </Select>

      <Radio.Group value={filters.sortOrder} onChange={(e) => onFilterChange({ sortOrder: e.target.value })}>
        <Radio.Button value='asc'>Asc</Radio.Button>
        <Radio.Button value='desc'>Desc</Radio.Button>
      </Radio.Group> */}
    </Space>
  );
};

export default ProductFilters;
