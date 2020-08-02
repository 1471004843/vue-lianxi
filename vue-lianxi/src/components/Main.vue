<template>
    <div id="main-wrap">
         <router-view></router-view>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
    #main-wrap{
        position: fixed;
        top:75px;
        left:250px;
        right:0px;
        bottom:0px;
        border: 30px solid #f7f7f7;
        border-bottom:none;
    }
</style>