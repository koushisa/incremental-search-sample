<template>
  <v-app id="app">
    <v-content>
      <v-container>
        <v-layout column>
          <v-flex>
            <app-combobox
              label="Qiitaの記事を検索"
              :model.sync="singleItem"
              :search-input.sync="query1"
              :search-func="searchQiita1"
              :search-results="qiitaItems"
              item-text="title"
              item-sub-text="url"
              item-identifier="url"
              single
            ></app-combobox>
          </v-flex>
          <v-flex>
            <app-combobox
              label="Qiitaの記事を選択(複数選択可能)"
              :model.sync="multiItem"
              :search-input.sync="query2"
              :search-func="searchQiita2"
              :search-results="qiitaItems"
              item-text="title"
              item-sub-text="url"
              item-identifier="url"
            ></app-combobox>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      singleItem: null,
      multiItem: [],

      //記事の検索条件(前方一致)
      query1: "",
      query2: "",

      //記事検索のレスポンス
      qiitaItems: []
    };
  },

  methods: {
    //記事検索
    searchQiita1() {
      axios
        .get(`https://qiita.com/api/v2/items?query=${this.query1}`)
        .then(response => (this.qiitaItems = response.data));
    },
    searchQiita2() {
      axios
        .get(`https://qiita.com/api/v2/items?query=${this.query2}`)
        .then(response => (this.qiitaItems = response.data));
    }
  }
};
</script>
