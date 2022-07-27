<template>
  <div class="all">
    <div class="left">
      <div class="left_title">
        <span>数据资产表目录</span><PlusCircleOutlined @click="stairAdd"/>
      </div>
      <div class="left_search">
        <a-input-search
          v-model:value="value"
          placeholder="按数据资产表名称或目录名称查询"
          enter-button
          @search="onSearch"
        />
      </div>
      <div class="left_menu">
        <a-menu
          id="dddddd"
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          style="width: 280px; background-color: #eee;"
          mode="inline"
          @click="handleClick"
          v-for="item in data"
          :key=item.stairId
        >
          <a-sub-menu :key=item.stairId @titleClick="titleClick">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>{{item.stairTitle}}<span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span></template>
            <div v-for="p in item.secondLevel" :key=p.secondId>
              <a-menu-item :key=p.secondId>{{p.secondTitle}}
                <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
              </a-menu-item>
            </div>
          </a-sub-menu>
          <!-- <a-sub-menu key="sub1" @titleClick="titleClick">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>启信宝数据</template>
              <a-menu-item key="1">企业工商信息
                <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
              </a-menu-item>
              <a-menu-item key="2">企业司法信息
                <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
              </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2" @titleClick="titleClick">
            <template #icon>
              <AppstoreOutlined />
            </template>
            <template #title>元素数据</template>
            <a-menu-item key="3">企业工商信息
              <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
              </a-menu-item>
            <a-menu-item key="4">企业司法信息
              <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #icon>
              <SettingOutlined />
            </template>
            <template #title>企业信息</template>
            <a-menu-item key="5">企业工商信息
              <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
            </a-menu-item>
            <a-menu-item key="6">企业司法信息
              <span><PlusCircleOutlined @click="add"/><MinusCircleOutlined @click="remove"/><EditOutlined @click="edit"/></span>
            </a-menu-item>
          </a-sub-menu> -->
        </a-menu>
      </div>
      <!-- 数据资产表目录新增目录弹框 -->
      <a-modal v-model:visible="stair_add" title="新增一级目录" @ok="handleOkStairAdd" ok-text="确认" cancel-text="取消" style="text-align:center" width="20rem" :ok-button-props="{style:{marginRight:'6rem'}}">
        <p class="tk"><span>*</span>目录名称：<input type="text" v-model="addStair"></p>
        <!-- <template slot="footer" style="margin: 0 auto;">
        </template> -->
      </a-modal>
      <!-- 数据资产表目录新增下级目录弹框 -->
      <a-modal v-model:visible="visible_add" title="新增下级目录" @ok="handleOkAdd" ok-text="确认" cancel-text="取消" style="text-align:center" width="20rem" :ok-button-props="{style:{marginRight:'6rem'}}">
        <p class="tk"><span>*</span>目录名称：<input type="text" v-model="addSecond"></p>
      </a-modal>
      <!-- 数据资产表目录编辑目录弹框 -->
      <a-modal v-model:visible="visible_edit" title="编辑目录" @ok="handleOkEdit" ok-text="确认" cancel-text="取消" style="text-align:center" width="20rem" :ok-button-props="{style:{marginRight:'6rem'}}">
        <p class="tk"><span>*</span>目录名称：<input type="text" v-model="editSecond"></p>
      </a-modal>
    </div>
    <div class="right">

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, createVNode  } from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined, PlusCircleOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  const selectedKeys = ref<string[]>(['1']);
  const openKeys = ref<string[]>(['sub1']);
  const handleClick: MenuProps['onClick'] = e => {
    console.log('click', e);
  };
  const titleClick = (e: Event) => {
    console.log('titleClick', e);
  };
  watch(
    () => openKeys,
    val => {
      console.log('openKeys', val);
    },
  );

  const value = ref<string>('');

  const onSearch = (searchValue: string) => {
    console.log('use value', searchValue);
    console.log('or use this.value', value.value);
  };
  const data = ref([
    {
      stairId:'sub1',
      stairTitle:'启信宝数据',
      secondLevel:[
        {
          secondId:'1',
          secondTitle:'企业工商信息'
        },
        {
          secondId:'2',
          secondTitle:'企业工商信息'
        },
        {
          secondId:'3',
          secondTitle:'企业工商信息'
        },
        {
          secondId:'4',
          secondTitle:'企业工商信息'
        }
      ]
    }
  ])
  const data1 = ref([
    {
      stairId:'',
      stairTitle:'',
      secondLevel:[
        {
          secondId:'',
          secondTitle:''
        }
      ]
    }
  ])

  //数据资产表目录新增目录
  const stair_add = ref<boolean>(false);
  const addStair =ref<string>()
  const stairAdd = (() => {
    stair_add.value = true;
    addStair.value = ''
  })
  const handleOkStairAdd = () => {
    stair_add.value = false;
    console.log(addStair.value);
    
    data.value.push()
  };
  //数据资产表目录新增下级目录
  const visible_add = ref<boolean>(false);
  const addSecond =ref<string>()
  const add = (() => {
    visible_add.value = true;
    addSecond.value = ''
  })
  const handleOkAdd = () => {
    visible_add.value = false;
    console.log(addSecond.value);
  };
  //数据资产表目录删除
  const remove = () => {
    Modal.confirm({
      title: '请确认是否删除该目录',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '是',
      cancelText: '否',
      onOk(){
        console.log('是');
      },
      onCancel(){
        console.log('否');
      }
    });
  }
  //数据资产表目录编辑
  const visible_edit = ref<boolean>(false);
  const editSecond =ref<string>()
  const edit = (() => {
    visible_edit.value = true;
    editSecond.value = ''
  })
  const handleOkEdit = () => {
    visible_edit.value = false;
    console.log(editSecond.value);
  };
</script>

<style lang="less" scoped>
.all{
  height: 100%;
  .left{
    width: 18%;
    height: 100%;
    background-color: #eee;
    border: 1px solid #bbb;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    .left_title{
      margin-top: 0.6rem;
      margin-bottom: 0.2rem;
      span{
        margin-right: 0.2rem;
      }
    }
    .left_search{
      margin-bottom: 0.4rem;
      width: 90%;
    }
    .left_menu{
      span{
        margin-left: 0.6rem;
      }
      ::v-deep .ant-menu-sub.ant-menu-inline{
        background-color: #eee;
      }
    }
  }
}
.tk{
  span{
    color: #e41818;
  }
  input{
    width: 75%;
    border: 1px solid #333;
    outline: none;
  }
}
</style>