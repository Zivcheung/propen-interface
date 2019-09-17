<template>
    <drawer
    v-if="visible"
    :config="drawerConfig"
    :placement="'right'"
    @closeDrawer="$emit('update:visible', false)">
      <div class="single-col-input-drawer">
        <el-form ref="form" :model="newProcessData" label-position="top" size="small">
          <el-form-item label="Process Name">
            <el-input class="single-col-input-drawer__input"
            placeholder="please enter"
            v-model="newProcessData.processName"></el-input>
          </el-form-item>
          <el-form-item label="Start Date">
            <el-date-picker class="single-col-input-drawer__input"
            type='date'
            placeHolder="pick start date"
            v-model="newProcessData.startDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="End Date">
            <el-date-picker class="single-col-input-drawer__input"
            type='date'
            placeHolder="pick end date"
            v-model="newProcessData.endDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="Method Name">
            <el-select class="single-col-input-drawer__input"
            placeholder="please enter"
            v-model="newProcessData.methodName"
            filterable
            allow-create
            default-first-option>
              <el-option
                v-for="method in document.methods"
                :label="method"
                :value="method"
                :key="method"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Concurrent">
            <el-select class="single-col-input-drawer__input"
            placeholder="Parallel develop with"
            v-model="newProcessData.concurrent">
              <el-option
                v-for="process in document.processes"
                :label="process.name"
                :value="process.id"
                :key="process.id"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <btn name="Submit" class="single-col-input-drawer__button"
              @click="submitHandler"></btn>
            <btn name="Reset"></btn>
          </el-form-item>
        </el-form>
      </div>
    </drawer>
</template>

<script>
import drawer from 'src/components/common/drawer';
import btn from 'src/components/common/btn';
import { mapState } from 'vuex';

export default {
  name: 'newProcessDrawer',
  components: {
    drawer,
    btn,
  },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      drawerConfig: {
        deepth: 400,
      },
      newProcessData: {
        processName: '',
        startDate: '',
        endDate: '',
        methodName: '',
        concurrent: '',
      },
    };
  },
  computed: {
    ...mapState('collabStore', [
      'document',
    ]),
  },
  methods: {
    submitHandler() {
      console.log(this.newProcessData);
      const payload = {
        projectId: this.$store.state.collabStore.currentProjectId,
        name: this.newProcessData.processName,
        startDate: this.newProcessData.startDate,
        endDate: this.newProcessData.endDate,
        methodName: this.newProcessData.methodName,
        concurrent: this.newProcessData.concurrent,
      };
      this.$$axios.post('/addNewProcess', payload)
        .then(res => {
        })
        .catch(err => alert(err));
    },
  },
};
</script>

<style src="@/single-col-input-drawer.css"></style>
