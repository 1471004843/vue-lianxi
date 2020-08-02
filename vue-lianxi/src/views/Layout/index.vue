<template>
    <div>
        <LayoutHeader></LayoutHeader>
        <LayoutMain></LayoutMain>
        <LayoutNav></LayoutNav>
    </div>
</template>
<script>
import LayoutHeader from "@/components/Header.vue"
import LayoutMain from "@/components/Main.vue"
import LayoutNav from "@/components/Nav.vue"
import Style from "@/styles/main.scss"
export default {
    name:"layout",
    components:{LayoutHeader,LayoutMain,LayoutNav},
    setup(){

    }
    
}
</script>
<style lang="scss" scoped>
  
</style>
