<template>
  <div>
    <a-modal v-model:visible="visible" :width="1000" title="JOSN数据导入">
      <a-form ref="JsonForm" :model="formState" layout="vertical" :label-col="{ span: 2 }" :wrapper-col="{ span: 25 }" autocomplete="off" @finish="validateJson">
        <a-form-item label="Josn数据" name="jsonValue" :rules="[{ required: true, message: '请输入Josn数据!' }]">
          <a-textarea v-model:value="formState.jsonValue" :rows="10" placeholder="请导入参数" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 20, offset: 20 }">
          <a-button size="big" :style="{ marginRight: '20px' }" @click="cancel">取消</a-button>
          <a-button type="primary" size="big" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
      <template #footer> </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import { message } from 'ant-design-vue';
  interface FormState {
    jsonValue: string;
  }
  // 定义接收参数
  const JsonForm: any = ref(null);
  const receive_object = ref();
  emitter.on('Josn', e => {
    visible.value = true;
    receive_object.value = e;
    try {
      JsonForm._rawValue.resetFields();
    } catch (err) {}
  });
  const visible = ref<boolean>(false);

  // 表单
  const formState = reactive<FormState>({
    jsonValue: '',
  });
  //取消
  const cancel = () => {
    visible.value = false;
  };

  // 递归Json,循环遍历
  const validateJson_way = obj => {
    let Json_object = [] as any;
    Object.keys(obj).forEach(item => {
      let type = '';
      let obj_type = '';
      type = typeof obj[item];
      obj_type = '2';
      if (type == 'number') {
        if (Math.ceil(obj[item]) == obj[item]) {
          obj_type = '3';
        } else {
          obj_type = '4';
        }
      }
      if (type == 'object') {
        if (obj[item] instanceof Array) {
          obj_type = '1';
        } else {
          obj_type = '0';
        }
      }
      let object = {
        interConfigName: item,
        interConfigDataType: obj_type,
        interConfigDescribe: '',
        configureId: [],
      } as any;
      if (type === 'object') {
        object.children = validateJson_way(obj[item]);
      }
      if (receive_object.value.Josn_to_name.toString() === '请求Body') {
        object.interConfigIsNull = '0';
        object.interConfigDefault = ' ';
      }
      Json_object.push(object);
    });
    return Json_object;
  };

  // Josn校验
  const validateJson = () => {
    let obj: any = null;
    if (formState.jsonValue == '') return message.warning('请输入Json数据');
    if (formState.jsonValue) {
      try {
        obj = JSON.parse(formState.jsonValue);
      } catch (e) {
        return message.warning('不是Json数据格式');
      }
    }
    if (obj && typeof obj == 'object') {
      let flag = false;
      Object.keys(obj).forEach(item => {
        if (receive_object.value.Josn_to_same_name.indexOf(item) !== -1) flag = true;
      });
      if (flag) return message.warning('与表格参数名称冲突');
    } else {
      return message.warning('不是josn格式');
    }
    let Json_object = validateJson_way(obj) as any;
    emitter.emit(receive_object.value.Josn_to_name.toString(), Json_object);
    visible.value = false;
  };
</script>
<style lang="less"></style>
