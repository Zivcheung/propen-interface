<template>
    <drawer 
    :config="drawerConfig"
    :placement="'right'"
    @closeDrawer="$emit('close')">
      <div class="single-col-input-drawer">
        <el-form ref="form" :model="newProcessData" label-position="top" size="small">
          <el-form-item label="Process Name">
            <el-input class="single-col-input-drawer__input" 
            placeholder="please enter"></el-input>
          </el-form-item>
          <el-form-item label="Start Date">
            <el-date-picker class="single-col-input-drawer__input"
            type='date'
            placeHolder="pick start date"></el-date-picker>
          </el-form-item>
          <el-form-item label="End Date">
            <el-date-picker class="single-col-input-drawer__input"
            type='date' 
            placeHolder="pick end date"></el-date-picker>
          </el-form-item>
          <el-form-item label="Method Name">
            <el-input class="single-col-input-drawer__input" 
            placeholder="please enter"></el-input>
          </el-form-item>
          <el-form-item label="Members">
            <el-select multiple class="single-col-input-drawer__select" 
            placeholder="involved members"></el-select>
          </el-form-item>
          <el-form-item label="Concurrent">
            <el-select multiple class="single-col-input-drawer__select" 
            placeholder="parallel development" size="large"></el-select>
          </el-form-item>
          <el-form-item>
            <btn name="Submit" class="single-col-input-drawer__button"></btn>
            <btn name="Reset"></btn>
          </el-form-item>
        </el-form>
      </div>
    </drawer>
</template>

<script>
import drawer from 'src/components/common/drawer';
import btn from 'src/components/common/btn';

export default {
  name: 'newProcessDrawer',
  components: {
    drawer,
    btn,
  },
  props: {
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
        members: [],
        concurrent: [],
      }
    }
  },
};
</script>

<style src="@/single-col-input-drawer.css"></style>
