// todo 实现封装一个axios
import api from '@/utils/axios';
import { SelectCodeTable } from './model';

enum Api {
  // 码表模糊查询
  Code_Table_Fuzzy_Query = '/selectCodeTable',
  // 新增码表
  Add_Code_Table = '/addCodeTable',
  // 改变码表状态
  On_Change = '/updateType',
  // 删除码表
  Delete_Code = '/deleteById',
  // 码表配置查询
  Select_Code_Configure = '/selectCodeConfigure',
  // 编辑码表
  Update_Code = '/updateCode',
}
export const selectCodeTable = (object: object) => api.post(Api.Code_Table_Fuzzy_Query, object);
export const AddCodeTable = (object: object) => api.post(Api.Add_Code_Table, object);
export const OnChange = (array: any) => api.post(Api.On_Change, array);
export const DeleteCode = (codeId: string) =>
  api({
    method: 'post',
    url: Api.Delete_Code,
    params: { codeId: codeId },
  });
export const SelectCodeConfigure = (code_id: string) =>
  api({
    method: 'post',
    url: Api.Select_Code_Configure,
    params: { code_id: code_id },
  });
export const UpdateCode = (object: any) => api.post(Api.Update_Code, object);
