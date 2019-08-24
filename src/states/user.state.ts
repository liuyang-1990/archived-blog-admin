import { injectable } from "inversify";
import { observable, action } from "mobx";
import { queryByPage, addUser, deleteUser, UpdateStatus, updateUser } from "@/services/user.service";
import { TableListData } from "@/models/TableList";
import { message } from 'antd';
@injectable()
export default class UserState {

    @observable loading: boolean = false;
    @observable data!: TableListData;
    @observable modalVisible: boolean = false;

    @action.bound
    async queryByPage(params?: any) {
        this.loading = true;
        const response = await queryByPage(params);
        this.loading = false;
        if (response) {
            this.data = {
                list: response.Rows,
                pagination: {
                    total: response.TotalRows,
                }
            }
        }
    }

    @action.bound
    async addUser(params, callback?) {
        const response = params.Id ? await updateUser(params) : await addUser(params);
        if (response) {
            switch (response.Status) {
                case '0':
                    message.success(`${params.Id ? '更新' : '添加'}成功`);
                    callback && callback();
                    this.queryByPage();
                    break;
                case '1':
                    message.error(`${params.Id ? '更新' : '添加'}失败`);
                    break;
                case '2':
                    message.warning('用户已存在');
                    break;
            }
        }
    }


    async deleteUser(id) {
        const response = await deleteUser(id);
        if (response) {
            switch (response.Status) {
                case '0':
                    message.success('删除成功');
                    this.queryByPage();
                    break;
                case '1':
                    message.error('删除失败');
                    break;
            }

        }
    }
    //批量改变用户状态（启用，禁用）
    @action.bound
    async UpdateStatus(params) {
        const response = await UpdateStatus(params);
        if (response) {
            switch (response.Status) {
                case '0':
                    message.success('更新成功');
                    this.queryByPage();
                    break;
                case '1':
                    message.error('更新失败');
                    break;
            }

        }
    }

    @action.bound
    handleModalVisible = (flag?: boolean) => {
        this.modalVisible == !!flag;
    };
}
