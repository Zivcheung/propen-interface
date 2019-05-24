<template>
  <div class="window-page-wp dashboard">
    <div class="dashboard__title">
     <i class="fas fa-rocket"></i>&nbsp;&nbsp;&nbsp;Project
    </div>
    <div class="dashboard__projects">
      <div class="dashboard__projects-panel">
        <el-button type="primary"
          @click="openCreateDialog"><i class="fas fa-plus"></i></el-button>
      </div>
      <div class="dashboard__projects-scroll" ref="project">
         <el-card class="dashboard__project-card" v-for=" item in 20">
          <div class="dashboard__project-card-title">A little cat service</div>
          <span class="dashboard__project-card-tag">Members:</span>
          <div class="dashboard__project-card-members">
            <el-tag class="dashboard__project-card-member" size="mini" v-for="i in 10">Tian</el-tag>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :visible.sync="centerDialog"
      width="40%"
      center>
      <div class="dashboard__project-create">
        <h4>New Project</h4>
        <el-form>
          <el-form-item label="Project name">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="Members">
            <el-input></el-input>
          </el-form-item>
        </el-form>
        <el-button class=""
          @click="createProject">Create !</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SimpleBar from 'simplebar';

export default {
  name: 'dashboard',
  data() {
    return {
      centerDialog: false,
      newProject: {
        projectName: '',
        members: '',
      },
    };
  },
  methods: {
    openCreateDialog() {
      this.centerDialog = true;
    },
  },
  mounted() {
    // new SimpleBar(this.$refs.project);
  },
};
</script>

<style src="@/dashboard.css"></style>
