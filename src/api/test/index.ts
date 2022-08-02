// todo 实现封装一个axios
import api from '@/utils/axios';
import exp from 'constants';
import { SelectCodeTable } from './model';

enum Api {
  // 码表管理
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
  //下载模板
  Down_execel = '/downExportExcel',
  //模板导入
  Import_execel = '/importExcel',

  //数据资产管理
  //数据资产目录表新增一级目录
  Add_Directory = '/addDirectory',
  //数据资产目录表新增子目录
  Insert_Directory = '/insertDirectory',
  //数据资产表目录按表名称或目录名称查询表
  Select_Directory = '/selectDirectory',
  //查询新增中的标准映射
  Standard_mapping = '/selectStandardMapping',
  //查询数据资产管理信息
  Select_DataAsset = '/selectDataAsset',
  //改变状态
  On_Change1 = '',

  //数据标准管理
  //数据标准目录页面查询

  Data_standard_catalog_Query = '/selectStandard',
  // 新增数据标准
  Add_Standard = '/addStandard',
  // 编辑数据标准
  Update_Standard = '/updateStandard',
  //编号查询
  Number_lookup = '/selectInfoById',
  // 发布
  Publish_Standard = '/publishStandard',
  // 删除
  Delete_Standard = '/deleteStandard',
  // 停用
  Block_Standard = '/blockStandard',
  // 枚举查询
  GetEnum_List = '/getEnumList',
  // 枚举范围详情
  Select_ConfigureInfoById = '/selectConfigureInfoById',
}
//码表管理
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
export const down = () => api.get(Api.Down_execel, { responseType: 'blob' });
export const importExcel = (data: any) =>
  api({
    method: 'get',
    url: Api.Import_execel,
    params: data,
  });

//数据资产管理
export const AddDirectory = (object: object) => api.post(Api.Add_Directory, object);
export const InsertDirectory = (object: object) => api.post(Api.Insert_Directory, object);
export const SelectDirectory = () => api.get(Api.Select_Directory);
export const StandardMapping = () => api.get(Api.Standard_mapping);

export const SelectDataAsset = (object: object) => api.post(Api.Select_DataAsset, object);
//改变状态
export const OnChange1 = (array: any) => api.post(Api.On_Change1, array);
export const PublishStandard = (array: any) => api.post(Api.Publish_Standard, array);
export const BlockStandard = (array: any) => api.post(Api.Block_Standard, array);
//数据标准管理
export const Catalog = (object: object) => api.post(Api.Data_standard_catalog_Query, object);
export const AddStandard = (object: object) => api.post(Api.Add_Standard, object);
export const UpdateStandard = (object: object) => api.post(Api.Update_Standard, object);
export const Delete_Standard = (standardId: string) =>
  api({
    method: 'post',
    url: Api.Delete_Standard,
    params: { standardId: standardId },
  });
export const GetEnum_List = () => api.get(Api.GetEnum_List);
export const Select_ConfigureInfoById = (codeId: string) =>
  api({
    method: 'get',
    url: Api.Select_ConfigureInfoById,
    params: { enumRange: codeId },
  });
//编号查询详情
export const Lookup = (standardId: string) =>
  api({
    method: 'get',
    url: Api.Number_lookup,
    params: { standardId: standardId },
  });
