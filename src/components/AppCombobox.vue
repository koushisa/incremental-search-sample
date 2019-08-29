<template>
  <v-combobox
    v-model="_model"
    :label="label"
    :items="searchResults"
    no-filter
    :search-input.sync="_searchInput"
    :allow-overflow="false"
    hide-no-data
    return-object
    :item-text="itemText"
    :item-value="itemIdentifier"
    chips
    small-chips
    deletable-chips
    :multiple="!single"
    :disabled="readonly"
  >
    <!-- 選択済みの要素はチップで表示 -->
    <template v-slot:selection="data">
      <!-- 単一 -->
      <template v-if="single">
        <v-chip
          v-if="typeof model[itemText] !== 'undefined'"
          :selected="data.selected"
          close
          class="chip--select-multi"
          @input="remove(model)"
        >{{ model[itemText]}}</v-chip>
      </template>
      <!-- 複数 -->
      <template v-else>
        <v-chip
          v-if="typeof data.item[itemText] !== 'undefined'"
          :selected="data.selected"
          close
          class="chip--select-multi"
          @input="remove(data.item)"
        >{{ data.item[itemText]}}</v-chip>
      </template>
    </template>

    <!-- 検索結果の表示部 -->
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-tile-content v-text="data.item"></v-list-tile-content>
      </template>
      <template v-else>
        <v-list-tile-content>
          <v-list-tile-title v-text="data.item[itemText]"></v-list-tile-title>
          <v-list-tile-sub-title v-text="data.item[itemSubText]"></v-list-tile-sub-title>
        </v-list-tile-content>
      </template>
    </template>
  </v-combobox>
</template>

<script>
import { throttle, isEmpty } from "lodash";

export default {
  props: {
    model: {
      type: [Object, Array, String],
      default: null
    },
    searchInput: {
      type: String,
      default: ""
    },
    searchFunc: {
      type: Function,
      required: true
    },
    searchResults: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: ""
    },
    itemText: {
      type: String,
      default: ""
    },
    itemSubText: {
      type: String,
      default: ""
    },
    itemIdentifier: {
      type: String,
      default: ""
    },
    single: {
      type: Boolean
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _model: {
      get() {
        return this.model;
      },
      set(newVal) {
        return this.$emit("update:model", newVal);
      }
    },
    _searchInput: {
      get() {
        return this.searchInput;
      },
      set(newVal) {
        return this.$emit("update:search-input", newVal);
      }
    }
  },
  watch: {
    //インクリメンタルサーチ
    searchInput(val, prev) {
      if (!isEmpty(val)) {
        this.searchWithInterval();
      }
    },
    // APIで取得した値のみ入力可能にします。
    model(val, prev) {
      //単一
      if (this.single) {
        if (val === null) {
          this.$emit("update:model", prev);
          return;
        }
        if (typeof val === "string") {
          this.$emit("update:model", prev);
          return;
        }
      } else {
        // 複数
        if (val.length === 0) {
          return;
        }
        if (typeof val[val.length - 1][this.itemIdentifier] === "undefined") {
          this.model.splice(this.model.length - 1, 1);
        }
      }
    }
  },
  created() {
    //APIの実行を0.5秒に1回に制限します。
    this.searchWithInterval = throttle(this.searchFunc, 500);
  },
  methods: {
    //チップを削除します。
    remove(selected) {
      //単一
      if (this.single) {
        this.$emit("update:model", {});
      } else {
        //複数
        const index = this.model.findIndex(
          item => item[this.itemIdentifier] === selected[this.itemIdentifier]
        );
        if (index >= 0) {
          this.model.splice(index, 1);
        }
      }
    }
  }
};
</script>
