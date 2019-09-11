import { injectable } from "inversify";
import { getProvince, getCity } from "@/services/geographic.service";
import { action, observable } from "mobx";
import { GeographicItemType, SelectItem } from "@/models/GeographicI";

@injectable()
export default class GeographicState {

    @observable loading: boolean = false;
    @observable province: Array<GeographicItemType> = [];
    @observable city: Array<GeographicItemType> = [];
    @observable value!: {
        province: SelectItem,
        city: SelectItem
    };

    @action
    async getProvince() {
        this.loading = true;
        const response = await getProvince();
        if (response) {
            this.province = response;
            this.city = await (getCity(this.province[0].id));
            this.value = {
                province: {
                    label: this.province[0].name,
                    key: this.province[0].id,
                },
                city: {
                    label: this.city[0].name,
                    key: this.city[0].id,
                }
            };
            this.loading = false;
        }
    }

    @action
    async getCity(item: SelectItem) {
        this.loading = true;
        const response = await getCity(item.key);
        this.loading = false;
        if (response) {
            this.city = response;
            this.value = {
                province: item,
                city: {
                    label: response[0].name,
                    key: response[0].id,
                }
            };
        }
    }

}