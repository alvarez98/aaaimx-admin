<template>
  <div class="components-container">
    <h3>{{ title }}</h3>
      <el-select
        v-model="author"
        filterable
        remote
        reserve-keyword
        :remote-method="getMember"
        :loading="loading"
        clearable
        placeholder="Selector author"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="`${item.surname} ${item.name}`"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button icon="el-icon-plus" @click="addAuthor()" size="small"
        >Add author</el-button
      >
    <div class="editor-container">
      <dnd-list
        :list1="authors"
        :list2="list2"
        list1-title="Authors"
        list2-title=""
      />
    </div>
  </div>
</template>

<script>
import DndList from "./DndList";
import { fetch } from "@/api/member";
import { searchMember } from "@/api/remote-search";
import { create, update } from "@/api/author";
import { mapState } from "vuex";

export default {
  name: "DndListDemo",
  components: { DndList },
  props: {
    title: {
      type: String,
      default: "list1"
    },
    authors: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      list1: [],
      list2: [],
      options: [],
      loading: false,
      author: ""
    };
  },
  computed: {
    ...mapState("members", ["collaborators"])
  },
  methods: {
    getMember(name) {
      this.loading = true;
      searchMember(name).then(response => {
        this.options = response.results;
        this.loading = false;
      });
    },
    async addAuthor() {
      if (!this.author.toString().trim()) return;
      let res = await fetch(this.author);
      const { name, surname, id } = res;
      const researchId = this.$route.params.id;
      let exist = this.authors.filter(el => el.name == name && el.surname == surname);
      if (!exist.length) {
        const author = {
          name,
          surname,
          member: id,
          research: researchId,
          position: this.authors.length + 1
        };
        let res = await create(author);
        let insertedAuthor = Object.assign({}, author, res)
        this.authors.push(insertedAuthor);
        this.$message({
          dangerouslyUseHTMLString: true,
          message: `Author created`,
          some: insertedAuthor,
          type: "success",
          showClose: true,
          duration: 2000
        });
      }
    }
  }
};
</script>
