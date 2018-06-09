<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {};
    }
};
</script>

<style lang="scss" scoped>
#app {
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
