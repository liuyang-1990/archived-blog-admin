import { injectable } from "inversify";
import { getProvince, getCity } from "@/services/geographic.service";
import { action, observable } from "mobx";
import { GeographicItemType } from "@/models/GeographicI";

@injectable()
export default class GeographicState {

    @observable loading: boolean = false;
    @observable province: Array<GeographicItemType> = [];
    @observable city: Array<GeographicItemType> = [];

    @action
    async getProvince() {
        this.loading = true;
        const response = await getProvince();
        this.loading = false;
        if (response) {
            this.province = response;
        }
    }

    @action
    async getCity(id: string) {
        this.loading = true;
        const response = await getCity(id);
        this.loading = false;
        if (response) {
            this.city = response;
        }
    }

}