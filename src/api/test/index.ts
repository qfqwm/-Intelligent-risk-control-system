// todo 实现封装一个axios
import api from '@/utils/axios';
import qs from 'qs';
import exp from 'constants';
import { SelectCodeTable } from './model';
import { omitBy } from 'lodash-es';

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
  On_Change1 = '/updateAsset',
  //删除资产表
  Delete_balShet = '/deleteAsset',
  //查询企业信息基本表
  Base_balShet = '/selectDataAssetAll',

  //数据标准管理
  //数据标准目录页面查询
  Data_standard_catalog_Query = '/selectAllStandard',
  //编号查询
  Number_lookup = '/selectInfoById',
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
export const OnChange1 = (object: any) => api.post(Api.On_Change1, object);

//查询企业信息基本表
export const rebaseTbl = object =>
  api({
    method: 'post',
    url: Api.Base_balShet,
    headers: {
      'Content-Type': 'application/json',
    },
    data: object,
  });

//删除balShet
export const deleteAsset = (assetId: any) => api.delete(Api.Delete_balShet + '/' + assetId);

//数据标准管理
//页面查询
export const Catalog = () => api.get(Api.Data_standard_catalog_Query);
//编号查询详情
export const Lookup = (standardId: string) =>
  api({
    method: 'get',
    url: Api.Number_lookup,
    params: { standardId: standardId },
  });
