import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import styles from './GeographicView.less';
import { observer } from 'mobx-react';
import { lazyInject } from '@/utils/ioc';
import GeographicState from '@/states/geographic.state';
import { GeographicItemType, SelectItem } from '@/models/GeographicI';

const { Option } = Select;

const nullSelectItem: SelectItem = {
    label: '',
    key: '',
};



@observer
class GeographicView extends Component<any, any> {

    @lazyInject('GeographicState')
    private store!: GeographicState;

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this.store.getProvince();
        const { onChange, value } = this.props;
        const { province, city } = this.store;
        if (!value && onChange) {
            onChange({
                province: {
                    label: province[0].name,
                    key: province[0].id,
                },
                city: {
                    label: city[0].name,
                    key: city[0].id,
                }
            });
        }
    }

    getProvinceOption() {
        const { province } = this.store;
        if (province) {
            return this.getOption(province);
        }
        return [];
    }

    getCityOption = () => {
        const { city } = this.store;
        if (city) {
            return this.getOption(city);
        }
        return [];
    };

    getOption = (list: GeographicItemType[]) => {
        if (!list || list.length < 1) {
            return (
                <Option key={0} value={0}>
                    没有找到选项
                </Option>
            );
        }
        return list.map(item => (
            <Option key={item.id} value={item.id}>
                {item.name}
            </Option>
        ));
    };

    selectProvinceItem = async (item: SelectItem) => {
        const { onChange } = this.props;
        const city = await this.store.getCity(item);
        if (onChange) {
            onChange({
                province: item,
                city: {
                    label: city[0].name, //默认选中该省份下面的第一个城市
                    key: city[0].id,
                },
            });
        }
    };

    selectCityItem = (item: SelectItem) => {
        const { value, onChange } = this.props;
        if (value && onChange) {
            onChange({
                province: value.province,
                city: item,
            });
        }
    };

    conversionObject() {
        const { value } = this.props;
        if (!value) {
            return {
                province: nullSelectItem,
                city: nullSelectItem,
            };
        }
        const { province, city } = value;
        return {
            province: province || nullSelectItem,
            city: city || nullSelectItem,
        };
    }

    render() {
        const { province, city } = this.conversionObject();
        return (
            <Spin spinning={this.store.loading} wrapperClassName={styles.row}>
                <Select
                    className={styles.item}
                    value={province}
                    labelInValue
                    showSearch
                    onSelect={this.selectProvinceItem}
                >
                    {this.getProvinceOption()}
                </Select>
                <Select
                    className={styles.item}
                    value={city}
                    labelInValue
                    showSearch
                    onSelect={this.selectCityItem}
                >
                    {this.getCityOption()}
                </Select>
            </Spin>
        );
    }
}

export default GeographicView;