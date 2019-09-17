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
         <el-card class="dashboard__project-card"
          v-for=" project in projectList"
          :key="project.id">
          <div
            @click="enterProjectHandler(project)">
            <div class="dashboard__project-card-title">{{project.name}}</div>
            <span class="dashboard__project-card-tag">Members:</span>
            <div class="dashboard__project-card-members">
              <el-tag class="dashboard__project-card-member" size="mini" v-for="member in project.members"
                :key="member">{{member}}</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :visible.sync="showCenterDialog"
      width="480px"
      center>
      <div class="dashboard__project-create">
        <h4>New Project</h4>
        <el-form label-position="top">
          <el-form-item label="Project name">
            <el-input
              class="dashboard__project-create-input"
              v-model="newProject.projectName"
              ></el-input>
          </el-form-item>
          <el-form-item label="Members">
            <el-select
              class="dashboard__project-create-input"
              v-model="newProject.members"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="add member by email"></el-select>
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
      showCenterDialog: false,
      newProject: {
        projectName: '',
        members: [],
      },
      projectList: [],
    };
  },
  methods: {
    clearNewProject() {
      this.newProject.projectName = '';
      this.newProject.members = [];
    },
    openCreateDialog() {
      this.showCenterDialog = true;
    },
    enterProjectHandler(project) {
      this.$router.push('/collaboration');
      this.$store.commit('collabStore/setCurrentProjectId', project.id);
    },
    createProject() {
      this.$$axios.post('newDocumentProject', {
        projectName: this.newProject.projectName,
        members: this.newProject.members,
      })
        .then((res) => {
          this.clearNewProject();
          this.showCenterDialog = false;
        })
        .catch((err) => {
          alert(err);
        });
    },
    getProjectList() {
      this.$$axios.get('/documentProjects')
        .then((res) => {
          const data = res.data;
          const projects = data.projects.map((item) => {
            const members = [item.creator].concat(item.members);
            return {
              id: item._id,
              name: item.name,
              members,
            };
          });
          this.projectList = projects;
        })
        .catch(err => alert(err));
    },
  },
  mounted() {
    // new SimpleBar(this.$refs.project);
    this.getProjectList();
  },
};
</script>

<style src="@/dashboard.css"></style>
