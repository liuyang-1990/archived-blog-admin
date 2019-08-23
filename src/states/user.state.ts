import { injectable } from "inversify";
import { observable, action } from "mobx";
import { queryByPage } from "@/services/user.service";
import { TableListData } from "@/models/TableList";

@injectable()
export default class UserState {
    @observable loading: boolean = false;
    @observable data!: TableListData;
    @action.bound
    async queryByPage(params) {
        this.loading = true;
        const response = await queryByPage(params);
        this.loading = false;
        if (response) {
            this.data = {
                list: response.Rows,
                pagination: {
                    total: response.TotalRows,
                    current: 1
                }
            }
        }
    }
}