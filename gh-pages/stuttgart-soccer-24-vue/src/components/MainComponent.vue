<template>
    <div id="main" class="w-100">
        <div class="main-wrapper">
            <header-component></header-component>
            <span v-if="parsedAt !== ''">Last updated {{Math.round(parsedAt.asMinutes())}} minutes ago</span>
            <div class="filters-container">
                <tabs-component :data="tabs" @dateOption="filterDataByDateCallback"></tabs-component>
                <dropdown-component :data="courts" @options="filterDataByCourtsCallback"></dropdown-component>
            </div>
            <cards-component :data="data"></cards-component>
        </div>
    </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>

<script>
    import data from "../scraped/data_today.json"
    import dataTomorrow from "../scraped/data_tomorrow.json"
    import dataOvermorrow from "../scraped/data_overmorrow.json"
    import moment from "moment";
    import HeaderComponent from "./layout/HeaderComponent.vue";
    import TabsComponent from "./filter/TabsComponent.vue";
    import DropdownComponent from "./filter/DropdownComponent.vue";
    import CardsComponent from "./cards/CardsComponent.vue";

    export default {
        components: {
            HeaderComponent,
            TabsComponent,
            DropdownComponent,
            CardsComponent,
        },
        data() {
            return {
                initialData: [],
                data: data,
                courts: [],
                parsedAt: '',
                tabs: [
                    {
                        name: 'TODAY',
                        value: moment().format('DD MMM'),
                    },
                    {
                        name: 'TOMORROW',
                        value: moment().add(1, 'days').format('DD MMM'),
                    },
                    {
                        name: 'IN 2 DAYS',
                        value: moment().add(2, 'days').format('DD MMM'),
                    }
                ],
                courtFilter: [],
                dateFilter: ""
            }
        },
        mounted() {
            this.resetData();
            this.getCourts();
            this.transform();
            this.setParsedAt();
        },
        methods: {
            resetData() {
                this.initialData = []
                const dataJoined = data.concat(dataTomorrow).concat(dataOvermorrow);
                for (let i in dataJoined) {
                    for (let j in dataJoined[i].results) {
                        const entry = dataJoined[i].results[j];
                        const dateStart =  moment(entry.time_slot_start);
                        const dateEnd = moment(entry.time_slot_end);
                        if (entry.is_available) {
                            this.initialData.push({
                                dateStart: dateStart.format("HH:mm"),
                                dateEnd: dateEnd.format("HH:mm"),
                                duration: moment.duration(dateEnd.diff(dateStart)).asMinutes(),
                                court: dataJoined[i].court,
                                datePart: moment(dataJoined[i].day).format("DD MMM"),
                                sourceWebsite: dataJoined[i].source_website
                            });
                        }
                    }
                }
            },
            transform() {
                this.data = this.initialData;
                this.filterDataByCourts(this.courtFilter);
                this.filterDataByDate(this.dateFilter);
            },
            getCourts: function () {
                for (let i in this.initialData) {
                    if (!this.courts.includes(this.initialData[i].court)) {
                        this.courts.push(this.initialData[i].court)
                    }
                }
            },
            filterDataByCourtsCallback: function(options) {
                this.courtFilter = options;
                this.transform();
            },
            filterDataByCourts: function (options) {
                if (this.courtFilter.length > 0) {
                    this.data = this.data.filter(item => {
                        let value = '';
                        for (let i in options) {
                            if (options[i] === item.court) {
                                value = options[i]
                            }
                        }
                        return value === item.court
                    })
                }
            },
            filterDataByDateCallback: function (option) {
                this.dateFilter = option;
                this.transform();
            },
            filterDataByDate: function (option) {
                if (this.dateFilter !== '') {
                    this.data = this.data.filter(item => {
                        return option === item.datePart
                    })
                }
            },
            setParsedAt: function () {
                this.parsedAt = moment.duration(moment().diff(data[0].parsed_at));
            }
        }
    }
</script>