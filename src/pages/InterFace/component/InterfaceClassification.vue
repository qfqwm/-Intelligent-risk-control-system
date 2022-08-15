<template>
  <div class="left">
    <div class="left_title">
      <span>接口分类</span>
      <PlusCircleOutlined @click="stairAdd" />
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
        <template #title="{ interDirName }">
          <span v-if="interDirName.indexOf(search) > -1">
            {{ interDirName.substr(0, interDirName.indexOf(search)) }}
            <span style="color: #1890ff">{{ search }}</span>
            {{ interDirName.substr(interDirName.indexOf(search) + search.length) }}
          </span>
          <span v-else>{{ interDirName }}</span>
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
      <a-form ref="formRef" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="目录名称">
          <a-input v-model:value="addStair" />
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
      <a-form ref="formRef" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="目录名称">
          <a-input v-model:value="addSecond" />
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
      <a-form ref="formRef" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="目录名称">
          <a-input v-model:value="editSecond" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, createVNode, watch } from 'vue';
  import { PlusCircleOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons-vue';
  import { InterfaceDeleteContents, InterfaceRenameContents, InterfaceAddContents, InterfaceSelectDirectory } from '@/api/test/index';
  import _ from 'lodash';
  import { Modal, message } from 'ant-design-vue';
  import emitter from '@/utils/bus';

  const color = ref('#fff');
  //数据资产目录展示
  const search = ref<string>('');
  const treeData = ref<any[]>([]);
  const showInterfaceClassification = () => {
    InterfaceSelectDirectory().then(res => {
      console.log(res.data.data);
      treeData.value = res.data.data;
    });
  };
  showInterfaceClassification();
  const fieldNames = {
    children: 'children',
    title: 'interDirName',
    key: 'interDirId',
    value: 'interDirId',
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
      expandedKeys.value = _.difference(keys, tempKeys).concat(node.interDirId);
    } else {
      expandedKeys.value = [];
    }
  };

  const intfc = ref('');
  const handleSelect = (keys: string[], { selected, node }) => {
    console.log(keys, selected, 'fff');
    editSecond.value = node.interDirName;
    intfc.value = keys[0];
    emitter.emit('sendf', intfc.value);
  };

  //数据资产表目录新增目录
  interface AddData {
    interDirName: string;
    parentId: number;
  }
  const AddData = ref({
    parentId: '',
    interDirName: '',
  });
  const stair_add = ref<boolean>(false);
  const addStair = ref<string>('');
  const stairAdd = () => {
    stair_add.value = true;
    addStair.value = '';
  };
  const handleOkStairAdd = () => {
    stair_add.value = false;
    AddData.value.parentId = null as any;
    AddData.value.interDirName = addStair.value;
    console.log(AddData.value);

    InterfaceAddContents(AddData.value).then(res => {
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
    showInterfaceClassification();
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
    AddData.value.interDirName = addSecond.value;
    InterfaceAddContents(AddData.value).then(res => {
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
    showInterfaceClassification();
  };

  //数据资产表目录删除
  const remove = () => {
    Modal.confirm({
      title: '请确认是否删除该目录',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '是',
      cancelText: '否',
      onOk() {
        InterfaceDeleteContents(aa.value[0]).then(res => {
          if (res.data.msg == '删除成功') {
            message.success('成功删除资产表目录');
          }
          if (res.data.msg == '该目录下存在正在使用的资产表，不可删除') {
            message.error(res.data.msg);
          }
          showInterfaceClassification();
        });
      },
    });
  };

  //数据资产表目录编辑
  const EditData = ref({
    interDirId: '',
    interDirName: '',
  });
  const visible_edit = ref<boolean>(false);
  const editSecond = ref();
  const edit = () => {
    visible_edit.value = true;
  };
  const handleOkEdit = () => {
    visible_edit.value = false;
    EditData.value.interDirId = aa.value[0];
    EditData.value.interDirName = editSecond.value;
    InterfaceRenameContents(EditData.value).then(res => {
      if (res.data.msg == '返回成功') {
        message.success('成功修改资产表目录');
      }
      if (res.data.code == '100401') {
        message.error('修改失败，资产表目录只支持中文及英文大小写');
      }
    });
    showInterfaceClassification();
  };
  //接口管理增删改查验证规则
  const rules = {
    addStair: [
      { required: true, message: '新增目录不能为空', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
  };
</script>
<style scoped lang="less">
  @import '@/pages/InterFace/css/InterfaceClassification.less';
</style>
