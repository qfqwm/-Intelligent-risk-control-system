<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <a-table :data-source="data" :columns="columns" :pagination="false" :row-selection="rowSelection">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span style="color: #1890ff">Name</span>
      </template>
    </template>
    <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style=" display: block; margin-bottom: 8px;width: 188px"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button type="primary" size="small" style=" margin-right: 8px;width: 90px" @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
          <template #icon><SearchOutlined /></template>
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)"> Reset </a-button>
      </div>
    </template>
    <template #customFilterIcon="{ filtered }">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>
    <!-- <template #bodyCell="{ text, column }">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))">
          <mark v-if="fragment.toLowerCase() === searchText.toLowerCase()" :key="i" class="highlight">
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
    </template> -->
  </a-table>
</template>
<script lang="ts" setup>
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { reactive, ref } from 'vue';
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Joe Black',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Jim Green',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ];

  const state = reactive({
    searchText: '',
    searchedColumn: '',
  });

  const searchInput = ref();

  const columns = [
    {
      title: '编码取值',
      dataIndex: 'name',
      key: 'name',
      customFilterDropdown: true,
      onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => {
            searchInput.value.focus();
          }, 100);
        }
      },
    },
    {
      title: '编码名称',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '编码含义',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    state.searchText = selectedKeys[0];
    state.searchedColumn = dataIndex;
  };

  const handleReset = clearFilters => {
    clearFilters({ confirm: true });
    state.searchText = '';
  };

  // 全选/反选
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
    },
  });
</script>
<style lang="less" scoped>
  .highlight {
    padding: 0px;
    background-color: rgb(255, 192, 105);
  }
</style>
