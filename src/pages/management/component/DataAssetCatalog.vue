<template>
  <div class="left">
    <div class="left_title">
      <span>数据资产表目录</span>
      <PlusCircleOutlined @click="stairAdd" />
    </div>
    <div class="left_search">
      <a-input-search v-model:value="search" placeholder="按资产表名称或目录名称查询" enter-button @search="onSearch" />
    </div>
    <div class="left_menu">
      <a-tree
        v-model:selectedKeys="selectedKeys"
        :expanded-keys="expandedKeys"
        :field-names="fieldNames"
        :tree-data="treeData"
        style="background-color: #eee"
        @expand="handleExpand"
        @select="handleSelect"
      >
        <template #title="{ name }">
          <span v-if="name.indexOf(search) > -1">
            {{ name.substr(0, name.indexOf(search)) }}
            <span style="color: #1890ff">{{ search }}</span>
            {{ name.substr(name.indexOf(search) + search.length) }}
          </span>
          <span v-else>{{ name }}</span>
          <span>
            <div id="components-a-popconfirm-demo-placement">
              <div :style="{ clear: 'both', whiteSpace: 'nowrap' }">
                <a-popconfirm placement="bottom" ok-text="是" cancel-text="否" @confirm="confirm">
                  <template #icon></template>
                  <template #title>
                    <p>
                      <a-button class="btn" @click="add">增加</a-button>
                    </p>
                    <p>
                      <a-button class="btn" @click="remove">删除</a-button>
                    </p>
                    <p>
                      <a-button class="btn" @click="edit">编辑</a-button>
                    </p>
                  </template>
                  <MoreOutlined />
                </a-popconfirm>
              </div>
            </div>
          </span>
        </template>
      </a-tree>
    </div>
    <!-- 数据资产表目录新增目录弹框 -->
    <a-modal
      v-model:visible="stair_add"
      title="新增一级目录"
      ok-text="确认"
      cancel-text="取消"
      style="text-align: center"
      width="80vh"
      :ok-button-props="{ style: { marginRight: '31vh' } }"
      @ok="handleOkStairAdd"
    >
      <p class="tk"><span>*</span>目录名称：<input v-model="addStair" type="text" /></p>
    </a-modal>
    <!-- 数据资产表目录新增下级目录弹框 -->
    <a-modal
      v-model:visible="visible_add"
      title="新增下级目录"
      ok-text="确认"
      cancel-text="取消"
      style="text-align: center"
      width="80vh"
      :ok-button-props="{ style: { marginRight: '31vh' } }"
      @ok="handleOkAdd"
    >
      <p class="tk"><span>*</span>目录名称：<input v-model="addSecond" type="text" /></p>
    </a-modal>
    <!-- 数据资产表目录编辑目录弹框 -->
    <a-modal
      v-model:visible="visible_edit"
      title="编辑目录"
      ok-text="确认"
      cancel-text="取消"
      style="text-align: center"
      width="80vh"
      :ok-button-props="{ style: { marginRight: '31vh' } }"
      @ok="handleOkEdit"
    >
      <p class="tk"><span>*</span>目录名称：<input v-model="editSecond" type="text" /></p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, createVNode, watch } from 'vue';
  import { PlusCircleOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons-vue';
  import { DeleteDirectory, UpdateDirectoryName, InsertDirectory, SelectDirectory } from '@/api/test/index';
  import _ from 'lodash';
  import emitter from '@/utils/bus';
  import { Modal, message } from 'ant-design-vue';
  const confirm = () => {
    message.info('Clicked on Yes.');
  };
  //数据资产目录展示
  const search = ref<string>('');
  const treeData = ref<any[]>([]);
  const showDataAssetCatalog = () => {
    SelectDirectory().then(res => {
      treeData.value = res.data.data;
    });
  };
  showDataAssetCatalog();
  const fieldNames = {
    children: 'children',
    title: 'name',
    key: 'directoryId',
    value: 'directoryId',
  };

  //数据资产表目录按表名称或目录名称查询
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys.value);
  });
  const aa = ref();
  watch(selectedKeys, () => {
    console.log('selectedKeys', selectedKeys.value);
    aa.value = selectedKeys.value;
  });
  const handleExpand = (keys: string[], { expanded, node }) => {
    console.log(keys, expanded, node);
    const tempKeys = ((node.children ? node.children : treeData) || []).map(({ key }) => key);
    if (expanded) {
      expandedKeys.value = _.difference(keys, tempKeys).concat(node.directoryId);
    } else {
      expandedKeys.value = [];
    }
  };

  const Asset = ref('');
  const handleSelect = (keys: string[], { selected, node }) => {
    console.log(keys, selected, 'fff');
    editSecond.value = node.name;
    Asset.value = keys[0];
    emitter.emit('sendf', Asset.value);
  };
  // 点击搜索进行模糊筛选
  const searchStr = ref('');
  const backupsExpandedKeys: any[] = [];
  const onSearch = () => {
    searchStr.value = search.value;
    if (searchStr.value === '') {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = [];
      const candidateKeysList = getkeyList(searchStr.value, treeData.value, []);
      candidateKeysList.forEach(item => {
        const key = getParentKey(item, treeData.value);
        if (key && !backupsExpandedKeys.some(item => item === key)) {
          backupsExpandedKeys.push(key);
        }
      });
      for (let i = 0; i < backupsExpandedKeys.length; i++) {
        getAllParentKey(backupsExpandedKeys[i], treeData.value);
      }
      expandedKeys.value = backupsExpandedKeys.slice();
    }
  };

  // 获取节点中含有value的所有key集合
  const getkeyList = (value, tree, keyList) => {
    let a = tree.length;
    for (let i = 0; i < a; i++) {
      const node = tree[i];
      if (node.name.indexOf(value) > -1) {
        keyList.push(node.directoryId);
      }
      if (node.children) {
        getkeyList(value, node.children, keyList);
      }
    }
    return keyList;
  };
  // 该递归主要用于获取key的父亲节点的key值
  const getParentKey = (key, tree) => {
    let parentKey;
    let temp;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.directoryId === key)) {
          parentKey = node.directoryId;
        } else if ((temp = getParentKey(key, node.children))) {
          parentKey = temp;
        }
      }
    }
    return parentKey;
  };
  // // 获取该节点的所有祖先节点
  const getAllParentKey = (key, tree) => {
    let parentKey;
    if (key) {
      parentKey = getParentKey(key, tree);
      if (parentKey) {
        if (!backupsExpandedKeys.some(item => item === parentKey)) {
          backupsExpandedKeys.push(parentKey);
        }
        getAllParentKey(parentKey, tree);
      }
    }
  };

  //数据资产表目录新增目录
  interface AddData {
    directoryName: string;
    parentId: string;
  }
  const AddData = ref({
    parentId: '',
    directoryName: '',
  });
  const stair_add = ref<boolean>(false);
  const addStair = ref<string>('');
  const stairAdd = () => {
    stair_add.value = true;
    addStair.value = '';
  };
  const handleOkStairAdd = () => {
    stair_add.value = false;
    AddData.value.parentId = '0';
    AddData.value.directoryName = addStair.value;
    InsertDirectory(AddData.value).then(res => {
      if (res.data.msg == '返回成功') {
        message.success('成功添加资产表目录');
      }
      if (res.data.msg == 'directoryName只支持中文及英文大小写') {
        message.error('添加失败，资产表目录只支持中文及英文大小写');
      }
      if (res.data.msg == '请求参数错误，存在重复项') {
        message.error('添加失败，资产表目录中有重复项');
      }
    });
    showDataAssetCatalog();
  };
  //数据资产表目录新增下级目录
  const visible_add = ref<boolean>(false);
  const addSecond = ref();
  const add = () => {
    visible_add.value = true;
    addSecond.value = '';
  };
  const handleOkAdd = () => {
    visible_add.value = false;
    AddData.value.parentId = aa.value[0];
    AddData.value.directoryName = addSecond.value;
    InsertDirectory(AddData.value).then(res => {
      if (res.data.msg == '返回成功') {
        message.success('成功新增资产表目录');
      }
      if (res.data.msg == 'directoryName只支持中文及英文大小写') {
        message.error('添加失败，资产表目录只支持中文及英文大小写');
      }
      if (res.data.msg == '请求参数错误，存在重复项') {
        message.success('添加失败，资产表目录中有重复项');
      }
    });
    showDataAssetCatalog();
  };

  //数据资产表目录删除
  const remove = () => {
    Modal.confirm({
      title: '请确认是否删除该目录',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '是',
      cancelText: '否',
      onOk() {
        DeleteDirectory(aa.value[0]).then(res => {
          if (res.data.msg == '删除成功') {
            message.success('成功删除资产表目录');
          }
          if (res.data.msg == '该目录下存在正在使用的资产表，不可删除') {
            message.error(res.data.msg);
          }
          showDataAssetCatalog();
        });
      },
    });
  };

  //数据资产表目录编辑
  const EditData = ref({
    directoryId: '',
    directoryName: '',
  });
  const visible_edit = ref<boolean>(false);
  const editSecond = ref();
  const edit = () => {
    visible_edit.value = true;
  };
  const handleOkEdit = () => {
    visible_edit.value = false;
    EditData.value.directoryId = aa.value[0];
    EditData.value.directoryName = editSecond.value;
    UpdateDirectoryName(EditData.value).then(res => {
      if (res.data.msg == '返回成功') {
        message.success('成功修改资产表目录');
      }
      if (res.data.code == '100401') {
        message.error('修改失败，资产表目录只支持中文及英文大小写');
      }
    });
    showDataAssetCatalog();
  };
</script>
<style lang="less" scoped>
  @import '@/pages/management/DataAssetCatalog.less';
</style>
