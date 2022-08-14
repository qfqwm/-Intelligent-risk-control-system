<template>
  <!-- 添加/编辑弹框 -->
  <div v-show="show.inmask" class="PopupMask">
    <!-- 添加/编辑 -->
    <div v-if="show.add_edit_incode" class="codediv">
      <h4 v-if="props.record_index == null">添加编码配置</h4><h4 v-else>编辑编码配置</h4>
      <hr />
      <div class="content"> 编码名称：<input v-model="codename" type="text" placeholder="请输入编码名称" /> 编码含义：<textarea v-model="codemeaning" placeholder="请输入编码含义"></textarea></div>
      <div class="bottom">
        <a-button size="small" @click="cancelconfigure">取消</a-button>
        <a-button type="primary" size="small" @click="confirmaconfigure">确认</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  const emits = defineEmits(['codepztable']);
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    index_num: number;
    // eslint-disable-next-line vue/prop-name-casing
    record_index: any;
    // eslint-disable-next-line vue/prop-name-casing
    change_add_edit: boolean;
    // eslint-disable-next-line vue/prop-name-casing
    code_configure_list: any;
    // eslint-disable-next-line vue/prop-name-casing
    record_object: any;
  };
  const props = defineProps<Props>();
  const show = reactive({ inmask: false, add_edit_incode: false });
  watch(
    () => props.index_num,
    () => {
      add_edit_codeconfigure();
      console.log(props.code_configure_list);
      codepztable.value = props.code_configure_list;
      console.log(codepztable.value, 111);
      if (props.record_index !== null) {
        codename.value = props.code_configure_list[props.record_index].configureName;
        codemeaning.value = props.code_configure_list[props.record_index].configureMean;
      } else {
        codename.value = '';
        codemeaning.value = '';
      }
    },
  );
  const add_edit_codeconfigure = () => {
    show.inmask = true;
    show.add_edit_incode = true;
  };
  // 编码配置
  const codename = ref('');
  const codemeaning = ref('');
  const codepztable = ref<any>();
  // 取消新增编码配置添加按钮
  const cancelconfigure = () => {
    show.inmask = false;
    show.add_edit_incode = false;
  };
  // 确定编码配置添加按钮
  const confirmaconfigure = () => {
    let checkname = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (!checkname.test(codename.value)) return message.error('请输入正确的码值名称');
    let more_name: string[] = [];
    for (let i = 0; i < codepztable.value.length; i++) {
      more_name.push(codepztable.value[i].configureName);
    }
    more_name = [...new Set(more_name)];
    if (more_name.indexOf(codename.value) !== -1 && props.record_index == null) return message.error('码值名字重复');
    // 新增页面
    if (props.change_add_edit) {
      // 添加
      if (props.record_index == null) {
        codepztable.value.push({ configureName: codename.value, configureMean: codemeaning.value, configureValue: '0' + (codepztable.value.length + 1) });
      }
      // 编辑
      else {
        if (more_name.indexOf(codename.value) !== -1 && codepztable.value[props.record_index].configureName != codename.value) return message.error('码值名字重复');
        codepztable.value[props.record_index].configureName = codename.value;
        codepztable.value[props.record_index].configureMean = codemeaning.value;
      }
    }
    // 编辑页面
    else {
      // 添加
      if (props.record_index == null) {
        let length = codepztable.value.length;
        codepztable.value.push({
          configureValue: length < 0 ? '0' + (length + 1) : length + 1 + '',
          codeId: props.record_object.codeId,
          configureType: 2,
          configureName: codename.value,
          configureMean: codemeaning.value,
        });
      }
      //   编辑
      else {
        if (more_name.indexOf(codename.value) !== -1 && codepztable.value[props.record_index].configureName != codename.value) return message.error('码值名字重复');
        // 判断是否是新加入的数据，或则已经做了删除操作的数据
        if (codepztable.value[props.record_index].configureType !== 2 || codepztable.value[props.record_index].configureType !== 1) {
          codepztable.value[props.record_index].configureType = 3;
        }
        codepztable.value[props.record_index].configureName = codename.value;
        codepztable.value[props.record_index].configureMean = codemeaning.value;
      }
    }
    codename.value = '';
    codemeaning.value = '';
    emits('codepztable', codepztable.value);
    show.inmask = false;
    show.add_edit_incode = false;
  };
</script>
<style lang="less" scoped>
  @import './css/CodingConfiguration.less';
</style>
