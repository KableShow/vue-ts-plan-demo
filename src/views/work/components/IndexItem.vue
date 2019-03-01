<template functional>
  <li
    :class="$style.item"
    @click="props.openComponent(props.item.date, props.item.planId)">
    <div :class="$style.item__time">
      <p>{{props.item.date | datetime('MM/DD')}}</p>
      <p>{{props.item.date | datetime('星期dd')}}</p>
    </div>
    <div v-if="props.item.planName" :class="$style.item__info">
      <p>计划：{{props.item.planName}}</p>
      <p>时间：{{props.item.startTime | datetime('HH:mm')}} - {{props.item.endTime | datetime('HH:mm')}}</p>         
    </div>
    <div v-else :class="[$style.item__info, $style['item__info--none']]">
      <p>未制定计划</p>
    </div>
    <div :class="$style.item__arrow"></div>
  </li>
</template>

<style lang="less" module>
  @blue: #39f;
  .item {
    display: flex;
    height: 90px;
    padding: 10px;
    &:nth-child(odd) { background-color: #fff; }
    &__arrow {
      flex-shrink: 0;
      width: 18px;
      height: 100%;
      background: url('@/assets/common/rightArrow.png') no-repeat right center;
      background-size: 8px 12px;
    }
    &__time {
      flex-shrink: 0;
      width: 50px;
      margin-top: 15px;
      margin-right: 10px;
      text-align: center;
      color: @blue;
    }
    &__info {
      display: flex;
      flex: 1;
      min-width:0;
      min-height:0;
      flex-direction: column;
      justify-content: space-around;
      padding-left: 10px;
      border-left: 1px solid #aaa;
      p {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      &--none { color: #ccc; line-height: 70px; }
    }
  }
</style>
