<template>
  <div class="processviz">
    <template v-if="isNewProject">
      <el-button type="text"
        size="medium"
          class="processviz__newProjectBtn"
        @click="createProcessHandler">
        <i class="fas fa-feather-alt"></i>
        &nbsp;&nbsp;&nbsp;{{'Cick Here To Add First Step'}}
      </el-button>
    </template>
    <template v-else>
      <section class="processviz__scale-btns">
      <el-button
        class="processviz__scale-btn"
        size="mini" @click="changeTimeScaleHandler('days')">Day</el-button>
      <el-button
        class="processviz__scale-btn"
        size="mini" @click="changeTimeScaleHandler('weeks')">Week</el-button>
      <el-button
        class="processviz__scale-btn"
        size="mini" @click="changeTimeScaleHandler('months')">Month</el-button>
      </section>
      <section class="processviz-working-layout">
        <section class="processviz-working"
          @click.right="rightClickDelegation"
          @click.left="leftClickDelegation"
          ref="proceessvizDom">
          <div class="processviz-working__bglayer">
            <div class="processviz-working__bglayer-bg"></div>
            <div class="processviz-working__bglayer-d3-render">
              <svg class="processviz__headersvg"
                ref="header"
                :width="sceneWidth"
                :height="50"></svg>
              <svg class="processviz-working__scenesvg"
                ref="scene"
                :width="sceneWidth"
                :height="sceneHeight"></svg>
            </div>
          </div>
          <div class="processviz-working__document-nodes-wp">
            <div class="processviz-working__document-node" v-for="(process, i) in document.processes"
            :key="process.id"
            :style="documentNodeStyleMap[i]"
            :class="documentNodeClassMap[i]"
            :data-id="process.id">
            </div>
          </div>
        </section>
        <section class="processviz-working__method-control">
          <div class="processviz-working__method-control-menu" :style="{height:sceneHeight+'px'}">
            <div class="method" v-for="(method, i) in document.methods"
              :key="method"
              :style="methodControlStyleMap[i]">
              {{method}}
              </div>
          </div>
        </section>
        <div class="processviz-working-layout__contextmenu">
            <context-menu :style="contextMenuStyleMap" v-if="showNodeContextMenu" :section-number="2">
              <template v-slot:section-1>
                <div class="contextmenu__option" @click="contributeButtonHandler(cntxtMenuId)">Contribute</div>
                <div class="contextmenu__option" @click="compileButtonHandler(cntxtMenuId)">Compile</div>
                <div class="contextmenu__option">Schedule</div>
                <div class="contextmenu__option">Members</div>
              </template>
              <template v-slot:section-2>
                <div class="contextmenu__option">Publicity</div>
                <div class="contextmenu__option">Delete</div>
              </template>
            </context-menu>
            <context-menu :style="contextMenuStyleMap" v-if="showContextMenu" :section-number="1">
              <template v-slot:section-1>
                <div class="contextmenu__option" @click="createProcessHandler">Create Process</div>
              </template>
            </context-menu>
          </div>
      </section>
    </template>
    <!-- <btn  name="Open right" @click="toggleRightArea"></btn> -->
    <contri-box type="contribute"></contri-box>
    <newProcessDrawer
      :visible.sync="showCreateDrawer">
    </newProcessDrawer>
  </div>
</template>

<script>
import * as d3 from 'd3';
import moment from 'moment';
import topNav from 'src/components/common/topNavigation';
import btn from 'src/components/common/btn';
import contextMenu from 'src/components/collaboration/contextMenu';
import newProcessDrawer from 'src/components/collaboration/newProcessDrawer';
import contriBox from 'src/components/collaboration/contributeBox';
import canvasLayout from 'src/components/common/workingCanvasLayout';
import SimpleBar from 'simplebar';
import { mapState } from 'vuex';
import { getIO } from 'src/plugins/io';

export default {
  name: 'collaboration',
  components: {
    topNav,
    btn,
    contextMenu,
    newProcessDrawer,
    contriBox,
    canvasLayout,
  },
  data() {
    return {
      cntxtMenuId: '',
      verticleScaleDist: 50,
      padding: 20,
      timeScaleBase: 'days',
      contextMenuPos: [0, 0],
      showNodeContextMenu: false,
      showContextMenu: false,
      showNewProcessDrawer: false,
      openRightArea: false,
      showCreateDrawer: false,
      io: null,
    };
  },
  computed: {
    ...mapState('collabStore', [
      'document',
      'documentState',
    ]),
    isNewProject() {
      return this.document.processes.length < 1;
    },
    processMethods() {
      return this.document.methods;
    },
    dateRange() {
      const processes = this.document.processes;
      const defaultDates = this.getDefaultDateRange();
      const datesBin = [
        defaultDates.startDate,
        defaultDates.endDate,
      ];
      if (processes.length > 0) {
        datesBin.push(processes[0].startDate);
        if (processes.length > 1) datesBin.push(processes[processes.length - 1].startDate);
        datesBin.sort((a, b) => a - b);
      }
      const start = this.formatTime(datesBin[0]);
      const end = this.formatTime(datesBin[datesBin.length - 1]);
      return [
        start,
        end,
      ];
    },
    sceneHeight() {
      return (this.document.methods.length * this.verticleScaleDist) + this.padding;
    },
    sceneWidth() {
      return (this.dateRangeDiff(this.timeScaleBase) * 76) + (2 * this.padding);
    },
    timeScaleType() {
      let type;
      switch (this.timeScaleBase) {
        case 'months':
          type = d3.timeMonth;
          break;
        case 'weeks':
          type = d3.timeWeek;
          break;
        case 'days':
          type = d3.timeDay;
          break;
        default:
          type = d3.timeMonth;
      }
      return type;
    },
    timeScale() {
      const timeScale = d3.scaleTime()
        .domain([this.dateRange[0], this.dateRange[1]])
        .range([this.padding, this.sceneWidth - this.padding]);
      return timeScale;
    },
    timeAxis() {
      return d3.axisBottom(this.timeScale)
        .ticks(this.timeScaleType);
    },
    methodScale() {
      const methodScale = d3.scaleOrdinal()
        .domain(this.document.methods)
        .range(this.document.methods.map((item, i) => (i + 1) * this.verticleScaleDist));
      return methodScale;
    },
    methodControlStyleMap() {
      return this.document.methods.map(item => ({
        top: `${this.methodScale(item)}px`,
      }));
    },
    documentNodeStyleMap() {
      return this.document.processes.map((item, i) => {
        const posX = this.timeScale(new Date(item.startDate));
        const posY = this.methodScale(item.methodName);

        return {
          transform: `translate(${posX}px,${posY}px)`,
        };
      });
    },
    documentNodeClassMap() {
      return this.document.processes.map(item => ({
        'processviz-working__document-node--compiled': item.compiled,
      }));
    },
    contextMenuStyleMap() {
      return {
        top: `${this.contextMenuPos[0]}px`,
        left: `${this.contextMenuPos[1]}px`,
      };
    },
  },
  methods: {
    getDefaultDateRange() {
      const start = new Date();
      start.setMonth(0);
      start.setDate(1);
      const end = new Date();
      end.setMonth(11);
      end.setDate(31);
      return {
        endDate: end,
        startDate: start,
      };
    },
    changeTimeScaleHandler(type) {
      this.timeScaleBase = type;
    },
    toggleRightArea() {
      this.$$observer.emit('openRightArea');
    },
    closeContextMenu() {
      this.showContextMenu = false;
      this.showNodeContextMenu = false;
      this.cntxtMenuId = '';
    },
    vizScrollHandler() {
      this.closeContextMenu();
    },
    rightClickDelegation(e) {
      e.preventDefault();
      this.contextMenuHandler(e, {
        className: 'processviz-working__document-node',
        showToggle: 'showNodeContextMenu',
      });
      this.contextMenuHandler(e, {
        className: 'processviz-working__scenesvg',
        showToggle: 'showContextMenu',
      });
    },
    leftClickDelegation(e) {
      e.preventDefault();
      const target = e.target;
      const targetClassList = Array.prototype.slice.call(target.classList, 0);
      if (targetClassList.indexOf('contextmenu') < 0) {
        this.closeContextMenu();
      } else if (targetClassList === 'contextmenu__option') {
        this.closeContextMenu();
      }
    },
    contextMenuHandler(e, option) {
      const target = e.target;
      const targetClassList = Array.prototype.slice.call(target.classList, 0);
      const provessVizDom = this.$refs.proceessvizDom;
      const rect = provessVizDom.getBoundingClientRect();
      if (targetClassList.indexOf(option.className) >= 0) {
        // get dom data and passing it down
        if (target.dataset.id) {
          this.cntxtMenuId = target.dataset.id;
        }
        this.$set(this.contextMenuPos, 1, e.clientX - rect.left);
        this.$set(this.contextMenuPos, 0, e.clientY - rect.top);
        this[option.showToggle] = true;
      } else {
        this[option.showToggle] = false;
      }
    },
    // functions in context menu
    contributeButtonHandler() {
      this.$$observer.$emit('openContriBox');
    },
    compileButtonHandler(id) {
      this.$router.push({ path: '/collaboration/compile', query: { id } });
    },
    createProcessHandler() {
      this.showCreateDrawer = true;
    },
    formatTime(time) {
      return new Date(time);
    },
    dateRangeDiff(type) {
      const start = moment(this.dateRange[0]);
      const end = moment(this.dateRange[1]);
      const between = end.diff(start, type);
      return between;
    },
    renderScene() {
      const me = this;
      const axiesHeader = d3.select(this.$refs.header);

      const scene = d3.select(this.$refs.scene);

      axiesHeader.append('g')
        .attr('class', 'processviz-working__headeraxies')
        .call(this.timeAxis);

      const methodAxis = scene.append('g')
        .selectAll('line')
        .data(this.document.methods)
        .enter();

      methodAxis.append('line')
        .attr('x1', this.padding)
        .attr('x2', this.sceneWidth)
        .attr('y1', function (d) {
          return me.methodScale(d);
        })
        .attr('y2', function (d) {
          return me.methodScale(d);
        })
        .attr('stroke', 'white')
        .attr('stroke-dasharray', '4 4');

      // scene.append('g')
      //   .selectAll('rect')
      //   .data.
    },
    updateAxis() {
      const axis = d3.select(this.$refs.header).select('g');

      axis.transition(2)
        .call(this.timeAxis);
    },
    updateMethodAxis() {
      const me = this;
      const scene = d3.select(this.$refs.scene)
        .select('g');
      const methodAxis = scene.selectAll('line')
        .data(this.document.methods);
      methodAxis.exit().remove();

      methodAxis.enter()
        .append('line')
        .attr('x1', this.padding)
        .attr('x2', this.sceneWidth)
        .attr('y1', function (d) {
          return me.methodScale(d);
        })
        .attr('y2', function (d) {
          return me.methodScale(d);
        })
        .attr('stroke', 'white')
        .attr('stroke-dasharray', '4 4');
    },
    initIO() {
      this.io = getIO();
      console.log(this.io);
      this.io.on('processUpdated', () => {
        console.log('processUpdated');
        this.$store.dispatch('collabStore/updateDocument');
      });
    },
  },
  watch: {
    timeAxis() {
      this.updateAxis();
      this.$nextTick(() => this.simpleBar.recalculate());
      // this.$forceUpdate();
    },
    processMethods() {
      this.updateMethodAxis();
      console.log('update method axies');
    },
  },
  mounted() {
    this.simpleBar = new SimpleBar(this.$refs.proceessvizDom, {
      forceVisible: false,
      scrollbarMinSize: 10,
    });
    this.simpleBar.getScrollElement().addEventListener('scroll', this.vizScrollHandler);
    setTimeout(() => {
      this.initIO();
    }, 0);
    this.renderScene();
  },
  updated() {
  },
};
</script>

<style src="@/processviz-working-layout.css"></style>
<style src="@/processviz-working.css"></style>
