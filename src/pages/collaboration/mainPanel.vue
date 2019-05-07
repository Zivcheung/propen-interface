<template>
  <article class="window-page-wp">
    <top-nav></top-nav>
    <canvas-layout :open-right="openRightArea">
      <template v-slot:center>
        <section class="processviz-working-layout" >
          <section class="processviz-working"
          @click.right="rightClickDelegation"
          @click.left="leftClickDelegation"
          ref="proceessvizDom">
          <div class="processviz-working__bglayer">
            <div class="processviz-working__bglayer-bg"></div>
            <div class="processviz-working__bglayer-d3-render" ref="scene"></div>
          </div>
          <div class="processviz-working__document-nodes-wp">
            <div class="processviz-working__document-node" v-for="(process, i) in mock"
            :key="process.id"
            :style="documentNodeStyleMap[i]"
            :class="documentNodeClassMap[i]">
            </div>
          </div>
          <div class="processviz-working__contextmenu">
            <context-menu :style="contextMenuStyleMap" v-if="showNodeContextMenu" :section-number="2">
              <template v-slot:section-1>
                <div class="contextmenu__option" @click="contributeButtonHandler">Contribute</div>
                <div class="contextmenu__option" @click="compileButtonHandler">Compile</div>
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
        <section class="processviz-working__method-control">
          <div class="processviz-working__method-control-menu" :style="{height:sceneHeight+'px'}">
            <div class="method" v-for="(method, i) in methodsMock" :key="method" :style="methodControlStyleMap[i]">{{method}}</div>
          </div>
        </section>
      </section>
      <btn  name="Add Method"></btn>
      <btn  name="Open right" @click="toggleRightArea"></btn>
      <contri-box type="contribute"></contri-box>
      </template>
      <template v-slot:right>
        <div></div>
      </template>
    </canvas-layout>
    
    <transition name='right-drawer'>
      <newProcessDrawer
        v-if="showNewProcessDrawer"
        @close="() => showNewProcessDrawer = false">
      </newProcessDrawer>
    </transition>
  </article>
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
      mock: [
        {
          startDate: '2018-1-1',
          endDate: '2018-10-1',
          methodName: 'field-trip',
          id: 'asdfasdfacncbnsd212',
          compiled: false,
        },
        {
          startDate: '2018-10-1',
          endDate: '2018-11-1',
          methodName: 'focus-group',
          id: 'asdfasdfsssfasd212',
          compiled: true,
        },
        {
          startDate: '2018-11-12',
          endDate: '2018-10-24',
          methodName: 'interview',
          id: 'asdfasdasdfaafaasdfsd212',
          compiled: true,
        },
        {
          startDate: '2018-4-5',
          endDate: '2018-10-1',
          methodName: 'expert-interview',
          id: 'asdfasdasdffasd212',
          compiled: false,
        },
        {
          startDate: '2019-8-1',
          endDate: '2019-11-1',
          methodName: 'interview',
          id: 'asdaafasdfsssfasd212',
          compiled: true,
        },
        {
          startDate: '2019-11-1',
          endDate: '2019-10-24',
          methodName: 'user-testing',
          id: 'asdfavbnvcsdasdfaafasd212',
          compiled: false,
        },
      ],
      methodsMock: [
        'field-trip',
        'interview',
        'focus-group',
        'expert-interview',
        'user-testing',
        'prototyping',
      ],
      verticleScaleDist: 50,
      padding: 100,
      timeScaleBase: 'months',
      contextMenuPos: [0, 0],
      showNodeContextMenu: false,
      showContextMenu: false,
      showNewProcessDrawer: false,
      openRightArea: false,
    };
  },
  computed: {
    dateRange() {
      const mock = this.mock;
      const start = this.formatTime(mock[0].startDate);
      const end = this.formatTime(mock[mock.length - 1].startDate);
      return [
        start,
        end,
      ];
    },
    sceneHeight() {
      return (this.methodsMock.length * this.verticleScaleDist) + this.padding;
    },
    sceneWidth() {
      return (this.dateRangeDiff(this.timeScaleBase) * 76) + (2 * this.padding);
    },
    timeScale() {
      const timeScale = d3.scaleTime()
        .domain([this.dateRange[0], this.dateRange[1]])
        .range([this.padding, this.sceneWidth - this.padding]);
      return timeScale;
    },
    methodScale() {
      const methodScale = d3.scaleOrdinal()
        .domain(this.methodsMock)
        .range(this.methodsMock.map((item, i) => (i + 1) * this.verticleScaleDist));
      return methodScale;
    },
    methodControlStyleMap() {
      return this.methodsMock.map(item => ({
        top: this.methodScale(item) + 'px',
      }));
    },
    documentNodeStyleMap() {
      return this.mock.map((item, i) => {
        const posX = this.timeScale(new Date(item.startDate));
        const posY = this.methodScale(item.methodName);

        return {
          transform: `translate(${posX}px,${posY}px)`,
        };
      });
    },
    documentNodeClassMap() {
      return this.mock.map((item) => ({
          'processviz-working__document-node--compiled': item.compiled,
      }));
    },
    contextMenuStyleMap(){
      return {
        top: `${this.contextMenuPos[0]}px`,
        left: `${this.contextMenuPos[1]}px`,
      };
    },
  },
  methods: {
    toggleRightArea() {
      this.openRightArea = !this.openRightArea;
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
        this.showNodeContextMenu = false;
        this.showContextMenu = false;
      }
    },
    contextMenuHandler(e, option) {
      const target = e.target;
      const targetClassList = Array.prototype.slice.call(target.classList, 0);
      const rect = this.$refs.proceessvizDom.getBoundingClientRect();
      if (targetClassList.indexOf(option.className) >= 0) {
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
    compileButtonHandler() {
      this.$router.push({ path: '/compileCanvas' });
    },
    createProcessHandler() {
      this.showNewProcessDrawer = true;
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
      let timeScaleType;
      switch (this.timeScaleBase) {
        case 'months':
          timeScaleType = d3.timeMonth;
          break;
        case 'years':
          timeScaleType = d3.timeYear;
          break;
        case 'days':
          timeScaleType = d3.timeDay;
          break;
        default:
          timeScaleType = d3.timeMonth;
      }
      const axiesHeader = d3.select(this.$refs.scene)
        .append('svg')
        .attr('width', this.sceneWidth)
        .attr('height', 50)
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0);

      const scene = d3.select(this.$refs.scene)
        .append('svg')
        .attr('class', 'processviz-working__scenesvg')
        .attr('width', this.sceneWidth)
        .attr('height', this.sceneHeight);

      const timeAxis = d3.axisBottom(this.timeScale)
        .ticks(timeScaleType);

      axiesHeader.append('g')
        .call(timeAxis);

      const methodAxis = scene.append('g')
        .selectAll('line')
        .data(this.methodsMock)
        .enter();

      methodAxis.append('line')
        .attr('x1', 0)
        .attr('x2', this.sceneWidth)
        .attr('y1', function (d) {
          return me.methodScale(d);
        })
        .attr('y2', function (d) {
          return me.methodScale(d);
        })
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '4 4');
    },
  },
  mounted() {
    this.areaWidth = window.innerWidth;
    this.renderScene();
  },
  updated() {
    // this.renderScene();
  },
};
</script>

<style src="@/processviz-working-layout.css"></style>
<style src="@/processviz-working.css"></style>
