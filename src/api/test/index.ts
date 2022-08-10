// todo 实现封装一个axios
import api from '@/utils/axios';

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
  //数据资产表目录按表名称或目录名称查询目录
  Select_Directory = '/selectDirectory',
  //查询新增中的标准映射
  Standard_mapping = '/selectStandardMapping',
  //查询数据资产管理信息
  Select_DataAsset = '/selectDataAsset',
  //新增数据资产表
  New_data_asset_sheet = '/addAsset',
  //编辑数据资产管理
  Edit_data_asset_management = '/updateAllAsset',
  //查询编辑页面需要的字段
  Query_the_basic = '/selectDataAssetAll',
  //数据资产表目录删除目录
  Delete_Directory = 'deleteDirectory',
  //数据资产表目录编辑目录
  Update_Directory_Name = 'updateDirectoryName',
  //改变状态
  On_Change1 = '/updateAsset',
  //删除资产表
  Delete_balShet = '/deleteAsset',
  //查询企业信息基本表
  Base_balShet = '/selectDataAssetAll',

  //数据标准管理
  //数据标准目录页面查询
  Data_standard_catalog_Query = '/selectStandard',
  // 新增数据标准
  Add_Standard = '/addStandard',
  // 编辑数据标准
  Update_Standard = '/updateStandard',
  //编号查询
  Number_lookup = '/selectInfoById',

  // 删除
  Delete_Standard = '/deleteStandard',
  update_StandardType = '/updateStandardType',

  // 枚举查询
  GetEnum_List = '/getEnumList',
  // 枚举范围详情
  Select_ConfigureInfoById = '/selectConfigureInfoById',

  //接口管理
  //目录查询
  Interface_Select_Directory = '/api/selectApiDirectory',
  //新增分类目录
  Interface_Add_Contents = '/api/addContents',
  //删除目录
  Interface_Delete_Contents = '/api/deleteContents',
  //编辑分类目录
  Interface_Rename_Contents = '/api/renameContents',
  //查询接口信息
  Query_interface_information = '/api/selectApiMsg',

  //数据库管理
  //查询数据库管理
  Query_database_administration = '/SelectDatabaseTables',
  //修改数据库状态
  Modify_the_database_state = '/updateDatabaseState',
  //连通测试
  Connectivity_test = '/ConnectJDBC',
  //新增数据源
  Add_new_data_source = '/InsertDatabaseTables',
  //编辑数据库信息
  Edit_the_database_information = '/updateDatabaseInfo',
  //删除数据库
  Delete_database = '/deleteDatabase/',
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
export const AssetSheet = (object: object) => api.post(Api.New_data_asset_sheet, object);
export const EditData1 = (object: object) => api.post(Api.Edit_data_asset_management, object);
export const QueryBasic = (name: any) => api.post(Api.Query_the_basic, name);
export const DeleteDirectory = (directoryId: string) => api.delete(Api.Delete_Directory, { params: { directoryId: directoryId } });
export const UpdateDirectoryName = (object: object) => api.post(Api.Update_Directory_Name, object);
export const OnChange1 = (object: any) => api.post(Api.On_Change1, object);
//查询企业信息基本表
export const rebaseTbl = (object: any) =>
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
export const Catalog = (object: object) => api.post(Api.Data_standard_catalog_Query, object);
export const AddStandard = (object: object) => api.post(Api.Add_Standard, object);
export const UpdateStandard = (object: object) => api.post(Api.Update_Standard, object);
export const Delete_Standard = (standardId: string) =>
  api({
    method: 'post',
    url: Api.Delete_Standard,
    params: { standardId: standardId },
  });
export const update_StandardType = (object: object) => api.post(Api.update_StandardType, object);
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

//接口管理
//目录查询
export const InterfaceSelectDirectory = () => api.get(Api.Interface_Select_Directory);
//目录增加
export const InterfaceAddContents = (object: object) => api.post(Api.Interface_Add_Contents, object);
//目录删除
export const InterfaceDeleteContents = (directoryId: string) => api.delete(Api.Interface_Delete_Contents, { params: { directoryId: directoryId } });
//目录分类编辑
export const InterfaceRenameContents = (object: object) => api.post(Api.Interface_Rename_Contents, object);
//查询接口信息
export const QueryInterface = (object: object) => api.get(Api.Query_interface_information, object);

//数据库管理
export const QueryAdministration = (object: object) => api.post(Api.Query_database_administration, object);
export const ModifyBatabase = (object: object) => api.post(Api.Modify_the_database_state, object);
export const ConnectivityTest = (object: object) => api.post(Api.Connectivity_test, object);
export const AddDataSource = (object: object) => api.post(Api.Add_new_data_source, object);
export const EditDatabase = (object: object) => api.post(Api.Edit_the_database_information, object);
export const DeleteDatabase = (databaseId: any) => api.post(Api.Delete_database + databaseId);
