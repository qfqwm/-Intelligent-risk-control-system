<template>
  <div>
    <a-modal v-model:visible="visible" title="接口批量分类" ok-text="确认" cancel-text="取消" @ok="handleOk">
      <a-row>
        <a-col :span="4"><a-typography-text>接口名称：</a-typography-text></a-col>
      </a-row>
      <a-row>
        <a-col v-for="item in classData" :key="item" :span="28">
          <a-checkbox v-model:checked="checked" disabled>{{ item.interMsgName }}</a-checkbox>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4"><a-typography-text>接口分类：</a-typography-text></a-col>
        <a-col :span="20">
          <a-input-search v-model:value="search" placeholder="Search" enter-button @search="onSearch"> </a-input-search>
          <a-card style="margin-top: 10px; width: 392px">
            <a-tree v-model:selectedKeys="selectedKeys" :expanded-keys="expandedKeys" :field-names="fieldNames" :tree-data="treeData" @expand="handleExpand" @select="handleSelect">
              <template #title="{ interDirName }">
                <span v-if="interDirName.indexOf(search) > -1">
                  {{ interDirName.substr(0, interDirName.indexOf(search)) }}
                  <span style="color: #1890ff">{{ search }}</span>
                  {{ interDirName.substr(interDirName.indexOf(search) + search.length) }}
                </span>
                <span v-else>{{ interDirName }}</span>
              </template>
            </a-tree>
          </a-card>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import emitter from '@/utils/bus';
  import { InterfaceSelectDirectory, InterfaceBatchClassify } from '@/api/test/index';
  import _ from 'lodash';

  const visible = ref();
  const classData = ref();
  emitter.on('batchclass', (data: any) => {
    visible.value = data.visible;
    classData.value = data.batchData;
  });
  //批量分类接口调用
  interface BatchData {
    interDirId: number;
    interfaceMsgIdList: [];
  }
  const batchData = ref<BatchData>({} as any);
  const ff = ref([] as any[]);
  const handleOk = () => {
    visible.value = false;
    classData.value.forEach(p => {
      ff.value.push(p.interMsgId);
    });
    batchData.value.interfaceMsgIdList = ff.value as any;
    console.log(batchData.value);
    InterfaceBatchClassify(batchData.value);
  };
  //接口名称
  const checked = ref(true);
  //搜索接口分类列表
  const search = ref<string>('');
  //数据资产目录展示
  const treeData = ref<any[]>([]);
  const showDataAssetCatalog = () => {
    InterfaceSelectDirectory().then(res => {
      treeData.value = res.data.data;
    });
  };
  showDataAssetCatalog();
  const fieldNames = {
    children: 'children',
    title: 'interDirName',
    key: 'interDirId',
    value: 'interDirId',
  };
  //数据资产表目录按表名称或目录名称查询
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);

  //点击重置取消资产目录的高亮显示
  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys.value);
  });
  watch(selectedKeys, () => {
    console.log('selectedKeys', selectedKeys.value);
  });
  const handleExpand = (keys: string[], { expanded, node }) => {
    // console.log(keys, expanded, node);
    const tempKeys = ((node.children ? node.children : treeData) || []).map(({ key }) => key);
    if (expanded) {
      expandedKeys.value = _.difference(keys, tempKeys).concat(node.interDirId);
    } else {
      expandedKeys.value = [];
    }
  };

  const handleSelect = (keys: string[]) => {
    console.log(keys);
    batchData.value.interDirId = Number(keys[0]);
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
      if (node.interDirName.indexOf(value) > -1) {
        keyList.push(node.interDirId);
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
        if (node.children.some(item => item.interDirId === key)) {
          parentKey = node.interDirId;
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
</script>

<style scoped lang="less"></style>
