<template>
  <div class="left">
    <div class="left_title">
      <span>数据资产表目录</span>
      <PlusCircleOutlined @click="stairAdd" />
    </div>
    <div class="left_search">
      <a-input-search v-model:value="search" placeholder="按目录名称查询" enter-button @search="onSearch" />
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
            <div id="components-a-tooltip-demo-placement">
              <div :style="{ clear: 'both', whiteSpace: 'nowrap' }">
                <a-tooltip placement="bottom" :color="color">
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
                </a-tooltip>
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
      <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="目录名称" :rules="rules" name="addStair">
          <a-input v-model:value="formState.addStair" />
        </a-form-item>
      </a-form>
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
      <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="目录名称" :rules="rules" name="addSecond">
          <a-input v-model:value="formState.addSecond" />
        </a-form-item>
      </a-form>
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
      <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="目录名称" :rules="rules" name="editSecond">
          <a-input v-model:value="formState.editSecond" />
        </a-form-item>
      </a-form>
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

  const color = ref('#fff');
  //数据资产目录展示
  const search = ref<string>('');
  const treeData = ref<any[]>([]);
  async function showDataAssetCatalog() {
    await SelectDirectory().then(res => {
      treeData.value = res.data.data;
    });
  }
  showDataAssetCatalog();
  const fieldNames = {
    children: 'children',
    title: 'name',
    key: 'directoryId',
    value: 'directoryId',
  };

  const fg = ref('');
  //接受主页面传过来的值
  emitter.on('reset', (t: any) => {
    fg.value = t.keys;
  });

  //数据资产表目录按表名称或目录名称查询
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);

  //点击重置取消资产目录的高亮显示
  watch(fg, () => {
    selectedKeys.value = [];
  });
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
    formState.editSecond = node.name;
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

  const formState = reactive({
    addStair: '',
    addSecond: '',
    editSecond: '',
  });
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
  const stairAdd = () => {
    stair_add.value = true;
    formState.addStair = '';
  };
  async function handleOkStairAdd() {
    stair_add.value = false;
    AddData.value.parentId = '0';
    AddData.value.directoryName = formState.addStair;
    await InsertDirectory(AddData.value).then(res => {
      if (res.data.code == 100200) message.success('成功添加资产表目录');
      if (res.data.code == 100081) message.error('当前目录下有重复目录');
    });
    showDataAssetCatalog();
  }
  //数据资产表目录新增下级目录
  const visible_add = ref<boolean>(false);
  const add = () => {
    visible_add.value = true;
    formState.addSecond = '';
  };
  async function handleOkAdd() {
    visible_add.value = false;
    AddData.value.parentId = aa.value[0];
    AddData.value.directoryName = formState.addSecond;
    await InsertDirectory(AddData.value).then(res => {
      if (res.data.code == 100200) message.success('成功添加资产表目录');
      if (res.data.code == 100081) message.error('当前目录下有重复目录');
    });
    showDataAssetCatalog();
  }

  //数据资产表目录删除
  const remove = () => {
    Modal.confirm({
      title: '请确认是否删除该目录',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '是',
      cancelText: '否',
      async onOk() {
        await DeleteDirectory(aa.value[0]).then(res => {
          if (res.data.code == 100200) message.success('成功删除资产表目录');
          if (res.data.code == 100401) message.error('该目录下存在正在使用的资产表，不可删除');
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
  const edit = () => {
    visible_edit.value = true;
  };
  async function handleOkEdit() {
    visible_edit.value = false;
    EditData.value.directoryId = aa.value[0];
    EditData.value.directoryName = formState.editSecond;
    await UpdateDirectoryName(EditData.value).then(res => {
      if (res.data.code == 100200) message.success('成功修改资产表目录名称');
    });
    showDataAssetCatalog();
  }
  //接口管理增删改查验证规则
  const rules = [
    { required: true, message: '新增目录不能为空' },
    { pattern: /^[^\s]*$/, message: '不允许输入空格' },
  ];
</script>
<style lang="less" scoped>
  @import '@/pages/management/DataAssetCatalog.less';
</style>
