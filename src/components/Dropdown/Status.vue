<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ status ? prop + ": " + labels[0] : prop + ": " + labels[1] }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="status" style="padding: 10px;">
          <el-radio :label="true">
            {{ labels[0] }}
          </el-radio>
          <el-radio :label="false">
            {{ labels[1] }}
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      default: "Status"
    },
    labels: {
      type: Array,
      default: () => ["Active", "Inactive"]
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    status: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
