import { injectable } from "inversify";
import { observable, action } from "mobx";
import { queryByPage, updateTag, addTag, deleteTag } from "@/services/tag.service";
import { message } from "antd";
import { ITableListData } from "@/models/TableList";
import { ITagTableListItem, ITagTableListParams } from "@/models/TagTableList";

@injectable()
export default class TagState {

    @observable loading: boolean = false;
    @observable data!: ITableListData<ITagTableListItem>;;

    @action.bound
    async queryByPage(params?: Partial<ITagTableListParams>) {
        this.loading = true;
        const response = await queryByPage(params);
        this.loading = false;
        if (response) {
            let pageIndex = 1;
            if (params && params.PageNum) {
                pageIndex = params.PageNum;
            }
            response.Rows.forEach(i => {
                i.key = i.Id.toString()
            });
            this.data = {
                list: response.Rows,
                pagination: {
                    total: response.TotalRows,
                    current: pageIndex
                }
            };
        }
    }

    @action.bound
    async handleOk(params, callback?) {
        const response = params.Id ? await updateTag(params) : await addTag(params);
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
                    message.warning('标签已存在');
                    break;
            }
        }
    }

    @action.bound
    async deleteTag(id: number) {
        const response = await deleteTag(id);
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


}
